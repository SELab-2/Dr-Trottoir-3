from rest_framework.decorators import action

from drtrottoir.models import (
    Building,
    ScheduleDefinitionBuilding,
    ScheduleDefinition,
    Syndicus,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    ScheduleDefinitionSerializer,
)
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response


class BuildingListViewSet(ModelViewSet):
    permission_classes = []

    queryset = Building.objects.all()
    serializer_class = BuildingSerializer

    @action(detail=True)
    def schedule_definitions(self, request, pk=None) -> Response:
        building_id = self.get_object().id
        schedule_buildings = ScheduleDefinitionBuilding.objects.filter(
            building=building_id
        )
        schedules = [query.schedule_definition.id for query in schedule_buildings]
        schedule_definitions = ScheduleDefinition.objects.filter(pk__in=schedules)
        serializer = ScheduleDefinitionSerializer(schedule_definitions, many=True)
        return Response(serializer.data)

    # get all buildings of syndicus with user id
    @action(detail=False, methods=["GET"], url_path=r"users/(?P<user_id>\w+)")
    def syndicus_buildings(self, request, user_id=-1):
        syndicus = Syndicus.objects.get(user=user_id)

        # buildings = []
        # for query in syndici:
        #     buildings.append(query.buildings.id)
        # buildings = [query.buildings.id for query in syndici]
        buildings = syndicus.buildings.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)
