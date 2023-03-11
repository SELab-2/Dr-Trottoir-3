from typing import Any

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
    """
    The GET item in ScheduleAssignment also allows students to access the entry, as
    long as that user is the same as the ScheduleAssignment's user field.
    To summarize, a user is allowed to GET an entry in ScheduleAssignment if:
    - They are an admin or a super student
    - They are a user and request.user.id == schedule_assignment.user.id
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            if user_is_superstudent_or_admin(request.user):
                return True
            if not user_is_student(request.user):
                return False

            if "pk" not in view.kwargs.keys():
                # If no ID is given, we are requesting the list. In this case, refuse
                # access
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


class ScheduleAssignmentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ScheduleAssignment.objects.all()
    serializer_class = ScheduleAssignmentSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        (ScheduleAssignmentPermission | IsSuperstudentOrAdmin),
    ]

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Certain fields in ScheduleAssignment are read-only. In the update (PATCH)
        method, we remove these fields from the request before performing the patch.
        """
        read_only_fields = ["assigned_date", "schedule_definition"]
        for field in read_only_fields:
            request.data.pop(field, False)
        return super().update(request, *args, **kwargs)

    @staticmethod
    @api_view(["GET"])
    def retrieve_list_by_date_and_user(request, assigned_date, user_id):
        """
        Permissions:
        A user is allowed to access the resources if:
        - They are an admin or a super student
        - They are a student and the request.user.id == user_id
        """

        request_is_superstudent_or_admin = user_is_superstudent_or_admin(request.user)
        request_is_student_and_id_matches = (
            user_is_student(request.user) and request.user.id == user_id
        )
        request_allowed = (
            request_is_superstudent_or_admin or request_is_student_and_id_matches
        )
        if not request_allowed:
            return Response(status=status.HTTP_403_FORBIDDEN)

        schedule_assignments = ScheduleAssignment.objects.filter(
            assigned_date=assigned_date, user_id=user_id
        )
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
