from typing import List

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

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

    permission_classes = [IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "list": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
    }

    filterset_fields = {
        "assigned_date": ("exact", "in", "gt", "lt"),
        "schedule_definition": ("exact", "in"),
        "user": ("exact", "in"),
    }
    search_fields: List[str] = []

    def get_queryset(self):
        """
        Admins and superstudents can access all schedule assignments, while
        regular users can only see their own.
        """
        if user_is_superstudent_or_admin(self.request.user):
            return ScheduleAssignment.objects.all()

        return ScheduleAssignment.objects.filter(user=self.request.user.id)
