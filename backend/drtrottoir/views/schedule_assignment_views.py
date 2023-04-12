from typing import Any, List

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from drtrottoir.models import ScheduleAssignment
from drtrottoir.permissions import (
    IsStudent,
    IsSuperstudentOrAdmin,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleAssignmentSerializer

from .mixins import PermissionsByActionMixin


class ScheduleAssignmentViewSet(PermissionsByActionMixin, viewsets.ModelViewSet):
    """
    Viewset for schedule assignments.
    Endpoints:
        /schedule_assignments/
            **POST:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Add a schedule assignment.
        /schedule_assignments/:schedule_assignment_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_assignment_views.ScheduleAssignmentPermission | drtrottoir.permissions.IsSuperstudentOrAdmin``
                Retrieve a schedule assignment by id.
            **PATCH:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Update this schedule assignment's data.
            **DELETE:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Delete this schedule assignment.
        /schedule_assignments/date/:assigned_date/user/:user_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_assignment_views.ScheduleAssignmentByDateAndUserPermission``
                Retrieve all schedule assignments on the given date assigned to given user.
    """  # noqa

    serializer_class = ScheduleAssignmentSerializer

    filterset_fields = ["assigned_date", "user"]
    search_fields: List[str] = []

    permission_classes = [IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "list": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
    }

    def get_queryset(self):
        """
        Admins and superstudents can access all schedule assignments, while
        regular users can only see their own.
        """
        if user_is_superstudent_or_admin(self.request.user):
            return ScheduleAssignment.objects.all()

        return ScheduleAssignment.objects.filter(user=self.request.user.id)

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """The POST method for the Schedule Assignment API. The assigned_date and
        schedule_definitions fields in ScheduleAssignment are read-only. so these
        are popped from the request data beforehand. The super update method is
        then called.
        Args:
            request (Request): A rest_framework Request containing the necessary fields.
            *args (Any): Additional args values as needed.
            **kwargs (Any): Additional kwargs values as needed.
        Returns:
            Response: An appropriate HTTP response based on the given request.
        """
        read_only_fields = ["assigned_date", "schedule_definition"]
        for field in read_only_fields:
            request.data.pop(field, False)
        return super().update(request, *args, **kwargs)
