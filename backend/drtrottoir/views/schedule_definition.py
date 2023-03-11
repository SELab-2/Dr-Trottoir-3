from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import ScheduleDefinition
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import BuildingSerializer, ScheduleDefinitionSerializer


class ScheduleDefinitionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = ScheduleDefinition.objects.all()
    serializer_class = ScheduleDefinitionSerializer

    @action(detail=True)
    def buildings(self, request, pk=None):
        schedule_definition = self.get_object()
        serializer = BuildingSerializer(schedule_definition.buildings, many=True)

        return Response(serializer.data)
