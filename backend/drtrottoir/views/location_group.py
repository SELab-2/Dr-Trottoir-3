from drtrottoir.models import LocationGroup
from drtrottoir.serializers import BuildingSerializer, LocationGroupSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class LocationGroupViewSet(ModelViewSet):
    permission_classes = []

    queryset = LocationGroup.objects.all()
    serializer_class = LocationGroupSerializer

    @action(detail=True)
    def buildings(self, request, pk=None) -> Response:
        location_group: LocationGroup = self.get_object()
        buildings = location_group.buildings.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def schedule_definitions(self, request, pk=None):
        pass
