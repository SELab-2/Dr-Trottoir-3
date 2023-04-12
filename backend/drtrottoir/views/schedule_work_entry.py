from typing import Any, List

from django.contrib.auth.models import AnonymousUser
from rest_framework import mixins, status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from drtrottoir.models import (
    ScheduleAssignment,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
)
from drtrottoir.permissions import (
    IsStudent,
    IsSuperstudentOrAdmin,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleWorkEntrySerializer


class ScheduleWorkEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    ViewSet of schedule work entries.

    Endpoints:

        /schedule_work_entries/
            **GET:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrHigher``

                All schedule work entries.
            **POST:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryPermission``

                Add a schedule work entry.

        /schedule_work_entries/:schedule_work_entry_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryGetByIdPermission``

                Retrieve a schedule work entry by its id.

        /schedule_work_entries/users/:user_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryByUserIdPermission``

                Retrieve all schedule work entries matching a user.

    """  # noqa

    permission_classes = [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin]

    serializer_class = ScheduleWorkEntrySerializer
    parser_classes = (MultiPartParser,)

    filterset_fields = {
        "creation_timestamp": ("exact", "in", "gt", "lt"),
        "creator": ("exact", "in"),
        "building": ("exact", "in"),
        "schedule_assignment": ("exact", "in"),
        "entry_type": ("exact", "in"),
    }
    search_fields: List[str] = []

    def get_queryset(self):
        """
        Admins and superstudents can access all work entries, while regular
        users can only see their own.
        """
        if user_is_superstudent_or_admin(self.request.user):
            return ScheduleWorkEntry.objects.all()

        return ScheduleWorkEntry.objects.filter(creator=self.request.user.id)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Overrides the default POST method of mixins.CreateModelMixin to add
        extra quality control to the data. Concretely, a POST method is accepted if:
            - request.user must be the same as request.data.creator
            - The building in request.data['building'] is in
              schedule_assignment.schedule_definition.buildings (or, put another way,
              there is an entry in ScheduleDefinitionBuilding where
              building=request.data.building and
              schedule_definition=request.data.schedule_definition

        If any of the two conditions are not valid, we return a 400_BAD_REQUEST error.
        If the given data is properly formatted, the super method is called and the
        ScheduleWorkEntry is created.

        Args:
            request (Request): The request containing the necessary fields and data.
            *args (Any): Additional args values as needed.
            **kwargs (Any): Additional kwargs values as needed.

        Returns:
            Response: A 200 response with the entry data if the data was properly
            formatted and the user had permissions. If the user didn't have permission
            a 404 response is returned. If the data is not properly formatted or the
            data is invalid, a 400 response is returned.

        """

        # At this point we've passed our permission checks, and we should
        # be authenticated. However, we need manually check if we are not
        # AnonymousUser or mypy's type checking will give errors.
        assert not isinstance(request.user, AnonymousUser)

        # Condition 1: request.user must be the same as request.data.creator
        data_creator_id = int(request.data["creator"])
        if not request.user.id == data_creator_id:
            return Response(
                {"Error": "Creator field does not match request user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Condition 3: The building in request.data['building'] is
        # in schedule_assignment.schedule_definition.buildings

        # Get schedule assignment object
        try:
            schedule_assignment_id = int(request.data["schedule_assignment"])
            schedule_assignment = ScheduleAssignment.objects.get(
                pk=schedule_assignment_id
            )
        except ScheduleAssignment.DoesNotExist:
            return Response(
                {"Error": "Given schedule assignment does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data_building_id = int(request.data["building"])
        schedule_definition_buildings = ScheduleDefinitionBuilding.objects.filter(
            building=data_building_id,
            schedule_definition=schedule_assignment.schedule_definition.id,
        )
        # Check if building in schedule definition
        if schedule_definition_buildings.count() == 0:
            return Response(
                {"Error": "Building not in schedule definition"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If at this point all checks passed, POST as mixins.CreateModelMixin
        return super().create(request, *args, **kwargs)
