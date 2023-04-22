from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import (
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
)
from drtrottoir.permissions import (
    HasAssignmentForScheduleDefinition,
    IsSuperstudentOrAdmin,
)
from drtrottoir.serializers import (
    ScheduleAssignmentSerializer,
    ScheduleDefinitionBuildingSerializer,
    ScheduleDefinitionSerializer,
    ScheduleWorkEntrySerializer,
)

from .mixins import PermissionsByActionMixin


class ScheduleDefinitionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    PermissionsByActionMixin,
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

    filterset_fields = {
        "version": ("exact", "in"),
        "location_group": ("exact", "in"),
        "buildings": ("exact",),
    }
    search_fields = ["name"]

    # This method allows more granular selection of permissions for any given
    # action
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
        "buildings": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
    }

    @action(detail=True)
    def buildings(self, request, pk=None):
        schedule_definition = self.get_object()
        buildings = ScheduleDefinitionBuilding.objects.filter(
            schedule_definition=schedule_definition
        ).order_by("position")
        serializer = ScheduleDefinitionBuildingSerializer(buildings, many=True)

        return Response(serializer.data)

    # This counts as a different action than 'buildings', and therefore falls
    # under the default permission_classes
    @buildings.mapping.post
    def set_buildings(self, request, pk=None):
        serializer = ScheduleDefinitionBuildingSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        schedule_definition = self.get_object()

        # Remove old order & replace with new order
        ScheduleDefinitionBuilding.objects.filter(
            schedule_definition=schedule_definition
        ).delete()
        ScheduleDefinitionBuilding.objects.bulk_create(
            (
                ScheduleDefinitionBuilding(
                    schedule_definition=schedule_definition,
                    building=binding["building"],
                    position=binding["position"],
                )
                for binding in serializer.validated_data
            )
        )

        # Return ordered list of buildings
        return self.buildings(request, pk)

    @action(detail=True)
    def schedule_assignments(self, request, pk=None):
        schedule_definition = self.get_object()
        assignments = schedule_definition.assignments.all()
        serializer = ScheduleAssignmentSerializer(assignments, many=True)

        return Response(serializer.data)

    @action(detail=True)
    def schedule_work_entries(self, request, pk=None):
        schedule_definition = self.get_object()
        schedule_work_entries = ScheduleWorkEntry.objects.filter(
            schedule_assignment__schedule_definition=schedule_definition
        )
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)

        return Response(serializer.data)
