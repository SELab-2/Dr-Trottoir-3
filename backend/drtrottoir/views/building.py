from rest_framework import status
from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser, FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import (
    Building,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    Syndicus,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    GarbageCollectionScheduleSerializer,
    GarbageCollectionScheduleTemplateSerializer,
    IssueSerializer,
    ScheduleDefinitionSerializer,
)
from drtrottoir.serializers.pdf_upload import PdfUploadSerializer


class BuildingListViewSet(ModelViewSet):
    permission_classes = []

    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    # parser_classes = (MultiPartParser, )

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
    @action(detail=False, url_path=r"users/(?P<user_id>\w+)")
    def syndicus_buildings(self, request, user_id=None):
        syndicus = Syndicus.objects.get(user=user_id)
        buildings = syndicus.buildings.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def issues(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        issues = building.issues.all()
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def garbage_collection_schedule_templates(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        templates = building.garbage_collection_schedule_templates.all()
        serializer = GarbageCollectionScheduleTemplateSerializer(templates, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def garbage_collection_schedules(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        schedules = building.garbage_collection_schedules.all()
        serializer = GarbageCollectionScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    @action(
        detail=True, url_path=r"for_day/(?P<date>[^/.]+)/garbage_collection_schedules"
    )
    def retrieve_garbage_collection_schedule_list_by_building_and_date(
        self, request, pk=None, date=None
    ) -> Response:
        building: Building = self.get_object()
        schedules = building.garbage_collection_schedules.filter(for_day=date)

        serializer = GarbageCollectionScheduleSerializer(schedules, many=True)
        return Response(serializer.data)


class PostDetailImageAPIView(APIView):
    # parser_classes = (FileUploadParser, )
    parser_class = (FileUploadParser,)


    def put(self, request, building_id):
        # file_obj = request.data['file']
        # print(f"FILE: {file_obj}")
        # print(building_id)
        # return Response(status=status.HTTP_200_OK)

        # serializer = PdfUploadSerializer(data=request.data)
        # if serializer.is_valid():
        #     return Response(status=status.HTTP_400_BAD_REQUEST)
        file = request.FILES['file']
        print(file)
        instance = Building.objects.get(id=building_id)
        data = {
            'pdf_guide': file
        }
        serializer = BuildingSerializer(instance, data=data, partial=True)
        if serializer.is_valid():
            print("BADBAD")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        # print(file)
        return Response(status=status.HTTP_201_CREATED)

