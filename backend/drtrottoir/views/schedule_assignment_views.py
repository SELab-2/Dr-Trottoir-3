from typing import Any

import rest_framework
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import ScheduleAssignment
from drtrottoir.permissions import (
    IsSuperstudentOrAdmin,
    user_is_student,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleAssignmentSerializer


class ScheduleAssignmentPermission(permissions.BasePermission):
    """Custom permissions class for the GET method ScheduleAssignmentViewSet class. The
    GET item in ScheduleAssignment also allows students to access the entry, as long
    as that user is the same as the ScheduleAssignment's user field.

    To summarize, a user is allowed to GET an entry in ScheduleAssignment if:
        - They are an admin or a super student
        - They are a user and request.user.id == schedule_assignment.user.id
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            # Super students and admins are allowed
            if user_is_superstudent_or_admin(request.user):
                return True
            # The user must be a student
            if not user_is_student(request.user):
                return False

            # If no ID is given, we are requesting the list. In this case, refuse access
            if "pk" not in view.kwargs.keys():
                return False

            schedule_assignment_id = int(view.kwargs["pk"])
            try:
                schedule_assignment = ScheduleAssignment.objects.get(
                    pk=schedule_assignment_id
                )
            except ScheduleAssignment.DoesNotExist:
                return False
            return schedule_assignment.user.id == request.user.id
        return False


class ScheduleAssignmentByDateAndUserPermission(permissions.BasePermission):
    """
    Custom permissions class for the ScheduleAssignmentViewSet
    retrieve_list_by_date_and_user method in the
    `/schedule_assignments/date/<date>/users/<user_id>/` url.

    A user is granted permission if:
        - They are an admin or a super student
        - They are a student and their user ID matches the ID
          in the url: request.user.id == user_id
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            # Super students or admins are allowed
            if user_is_superstudent_or_admin(request.user):
                return True
            # Otherwise the user must be a student
            if not user_is_student(request.user):
                return False
            # and their user_id must match the request user's id
            user_id = view.kwargs["user_id"]
            return request.user.id == user_id
        return False


class ScheduleAssignmentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
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

    """
    queryset = ScheduleAssignment.objects.all()
    serializer_class = ScheduleAssignmentSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        (ScheduleAssignmentPermission | IsSuperstudentOrAdmin),
    ]

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

    @staticmethod
    @api_view(["GET"])
    @rest_framework.decorators.permission_classes(
        [permissions.IsAuthenticated, ScheduleAssignmentByDateAndUserPermission]
    )
    def retrieve_list_by_date_and_user(
        request: Request, assigned_date: str, user_id: int
    ) -> Response:
        """Custom GET method to allow for the
        `/schedule_assignments/date/<date>/users/<user_id>/` url.

        Args:
            request (Request): A rest_framework Request containing the necessary
                fields.
            assigned_date (str): The date in string format we're asking for, in
                YYYY-MM-DD format.
            user_id (int): The int id of the user we're requesting the data for.

        Returns:
            Response: A list containing all the schedule assignments matching the
            user and date.

        """
        schedule_assignments = ScheduleAssignment.objects.filter(
            assigned_date=assigned_date, user_id=user_id
        )
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
