from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import ScheduleDefinition, ScheduleWorkEntry
from drtrottoir.permissions import (
    HasAssignmentForScheduleDefinition,
    IsSuperstudentOrAdmin,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    ScheduleAssignmentSerializer,
    ScheduleDefinitionSerializer,
    ScheduleWorkEntrySerializer,
)


class ScheduleDefinitionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewsets that handles all routes related to schedule definitions.

    Endpoints:

        /schedule_definitions/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                List all schedule definitions.

            **POST:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Create a new schedule definition.

        /schedule_definitions/:id/
            **GET:**
                required permission: ``drtrottoir.permissions.HasAssignmentForScheduleDefinition``

                Get information for a single schedule definition.

        /schedule_definitions/:id/buildings/
            **GET:**
                required permission: ``drtrottoir.permissions.HasAssignmentForScheduleDefinition``

                Get all buildings associated with a schedule definition.

        /schedule_definitions/:id/schedule_assignments/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Get all schedule assignments associated with a schedule
                definition.

        /schedule_definitions/:id/schedule_work_entries/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Get all schedule work entries associated with a schedule
                definition.
    """  # noqa

    queryset = ScheduleDefinition.objects.all()
    serializer_class = ScheduleDefinitionSerializer

    filterset_fields = ["version"]
    search_fields = ["name"]

    # This method allows more granular selection of permissions for any given
    # action
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
        "buildings": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
    }

    def get_permissions(self):
        if self.action not in self.permission_classes_by_action:
            return [perm() for perm in self.permission_classes]

        return [perm() for perm in self.permission_classes_by_action[self.action]]

    @action(detail=True)
    def buildings(self, request, pk=None):
        schedule_definition = self.get_object()
        buildings = self.paginate_queryset(schedule_definition.buildings)
        serializer = BuildingSerializer(buildings, many=True)

        return self.get_paginated_response(serializer.data)

    @action(detail=True)
    def schedule_assignments(self, request, pk=None):
        schedule_definition = self.get_object()
        assignments = self.paginate_queryset(schedule_definition.assignments)
        serializer = ScheduleAssignmentSerializer(
            assignments, many=True
        )

        return self.get_paginated_response(serializer.data)

    @action(detail=True)
    def schedule_work_entries(self, request, pk=None):
        schedule_definition = self.get_object()
        schedule_work_entries = self.paginate_queryset(ScheduleWorkEntry.objects.filter(
            schedule_assignment__schedule_definition=schedule_definition
        ))
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)

        return self.get_paginated_response(serializer.data)
