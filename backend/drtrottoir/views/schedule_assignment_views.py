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


class ScheduleAssignmentViewSet(viewsets.ModelViewSet):
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

    def get_permissions(self):
        if self.action not in self.permission_classes_by_action:
            return [perm() for perm in self.permission_classes]

        return [perm() for perm in self.permission_classes_by_action[self.action]]

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

    # @staticmethod
    # @api_view(["GET"])
    # @rest_framework.decorators.permission_classes(
    #     [permissions.IsAuthenticated, ScheduleAssignmentByDateAndUserPermission]
    # )
    # def retrieve_list_by_date_and_user(
    #     request: Request, assigned_date: str, user_id: int
    # ) -> Response:
    #     """Custom GET method to allow for the
    #     `/schedule_assignments/date/<date>/users/<user_id>/` url.

    #     Args:
    #         request (Request): A rest_framework Request containing the necessary
    #             fields.
    #         assigned_date (str): The date in string format we're asking for, in
    #             YYYY-MM-DD format.
    #         user_id (int): The int id of the user we're requesting the data for.

    #     Returns:
    #         Response: A list containing all the schedule assignments matching the
    #         user and date.

    #     """
    #     schedule_assignments = self.paginate_queryset(
    #         ScheduleAssignment.objects.filter(
    #             assigned_date=assigned_date, user_id=user_id
    #         )
    #     )
    #     serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
    #     return self.get_paginated_response(serializer.data, status=status.HTTP_200_OK)
