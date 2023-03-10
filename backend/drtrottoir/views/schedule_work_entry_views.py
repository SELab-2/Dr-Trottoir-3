from typing import Any

from django.contrib.auth.models import AnonymousUser
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import (
    ScheduleAssignment,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
)
from drtrottoir.permissions import (
    IsSuperstudentOrAdmin,
    user_is_student,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleWorkEntrySerializer


class ScheduleWorkEntryPermission(IsSuperstudentOrAdmin):
    """
    POST permissions for the ScheduleWorkEntry API also allows students to submit.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "POST":
            if isinstance(request.user, AnonymousUser):
                return False
            return user_is_student(request.user)
        # If not a post request, return default permissions
        return super().has_permission(request, view)


class ScheduleWorkEntryGetByIdPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            if "pk" not in view.kwargs.keys():
                # If no ID is given, we are requesting the list. In this case,
                # refuse access
                return False
            if isinstance(request.user, AnonymousUser):
                return False
            try:
                work_entry = ScheduleWorkEntry.objects.get(id=request.user.id)
                return work_entry.creator.id == request.user.id
            except ScheduleWorkEntry.DoesNotExist:
                return False
        return False


class ScheduleWorkEntryByUserIdPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        # Super students or admins always have access
        if user_is_superstudent_or_admin(request.user):
            return True

        # Students have access if request.user is the same as the user in the url
        if not user_is_student(request.user):
            return False
        return request.user.id == int(view.kwargs["user_id"])


class ScheduleWorkEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        (ScheduleWorkEntryPermission | ScheduleWorkEntryGetByIdPermission),
        IsAuthenticated,
    ]

    queryset = ScheduleWorkEntry.objects.all()
    serializer_class = ScheduleWorkEntrySerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        A POST request has several requirements for it to be accepted:
        1. request.user must be the same as request.data.creator
        2. The user in request.user is in one ScheduleAssignment happening today
        3. The building in request.data['building'] is
           in schedule_assignment.schedule_definition.buildings
           (or, put another way, there is an entry in ScheduleDefinitionBuilding where:
                building=request.data.building
                schedule_definition=request.data.schedule_definition
        If any of these are not the case, we return a 400_BAD_REQUEST error
        """
        if isinstance(request.user, AnonymousUser):
            # Manual check to please mypy
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Condition 1: request.user must be the same as request.data.creator
        data_creator_id = int(request.data["creator"])
        if not request.user.id == data_creator_id:
            return Response(
                {"Error": "Creator field does not match request user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Condition 2: The user in request.user is in one ScheduleAssignment
        # happening today
        # (TODO add today requirement)
        schedule_assignments = ScheduleAssignment.objects.filter(user=request.user)
        if schedule_assignments.count() == 0:
            return Response(
                {"Error": "User does not match schedule assignment"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Condition 3: The building in request.data['building'] is
        # in schedule_assignment.schedule_definition.buildings
        data_schedule_definition_id = int(request.data["schedule_definition"])
        data_building_id = int(request.data["building"])
        schedule_definition_buildings = ScheduleDefinitionBuilding.objects.filter(
            building=data_building_id, schedule_definition=data_schedule_definition_id
        )
        if schedule_definition_buildings.count() == 0:
            return Response(
                {"Error": "Building not in schedule definition"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If at this point all checks passed, POST as mixins.CreateModelMixin
        return super().create(request, *args, **kwargs)

    # Get schedule work entry by user id
    @staticmethod
    @api_view(["GET"])
    def retrieve_by_user_id(request, user_id):
        request_is_superstudent_or_admin = user_is_superstudent_or_admin(request.user)
        request_is_student_and_id_matches = (
            user_is_student(request.user) and user_id == request.user.id
        )
        request_allowed = (
            request_is_superstudent_or_admin or request_is_student_and_id_matches
        )

        if not request_allowed:
            return Response(status=status.HTTP_403_FORBIDDEN)

        work_entries = ScheduleWorkEntry.objects.filter(creator=user_id)
        serializer = ScheduleWorkEntrySerializer(work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
