from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import ScheduleDefinition
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
    permission_classes_by_action = {
        "list": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
        "retrieve": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
        "buildings": [permissions.IsAuthenticated, HasAssignmentForScheduleDefinition],
        "schedule_work_entries": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
        "schedule_assignments": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
    }

    queryset = ScheduleDefinition.objects.all()
    serializer_class = ScheduleDefinitionSerializer

    def get_permissions(self):
        return [perm() for perm in self.permission_classes_by_action[self.action]]

    @action(detail=True)
    def buildings(self, request, pk=None):
        schedule_definition = self.get_object()
        serializer = BuildingSerializer(schedule_definition.buildings, many=True)

        return Response(serializer.data)

    @action(detail=True)
    def schedule_assignments(self, request, pk=None):
        schedule_definition = self.get_object()
        serializer = ScheduleAssignmentSerializer(
            schedule_definition.schedule_assignments, many=True
        )

        return Response(serializer.data)

    @action(detail=True)
    def schedule_work_entries(self, request, pk=None):
        schedule_definition = self.get_object()
        serializer = ScheduleWorkEntrySerializer(
            schedule_definition.work_entries, many=True
        )

        return Response(serializer.data)
