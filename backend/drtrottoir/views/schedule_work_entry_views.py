from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import ScheduleWorkEntry
from drtrottoir.serializers import ScheduleWorkEntrySerializer

# TODO permissions


class ScheduleWorkEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = []

    queryset = ScheduleWorkEntry.objects.all()
    serializer_class = ScheduleWorkEntrySerializer

    # Get schedule work entry by user id
    @action(detail=False, methods=["GET"], url_path=r"users/(?P<user_id>\w+)")
    def email_messages(self, request, user_id=-1):
        work_entries = ScheduleWorkEntry.objects.filter(creator=user_id)
        serializer = self.get_serializer(work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


"""
class ScheduleWorkEntryListApiView(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request) -> Response:
        schedule_work_entries = ScheduleWorkEntry.objects
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        request_user = request.user
        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        creation_timestamp = request.data.get("creation_timestamp")
        image_path = request.data.get("image_path")
        creator = request.data.get("creator")
        building = request.data.get("building")
        schedule_definition = request.data.get("schedule_definition")

        data = {
            "creation_timestamp": creation_timestamp,
            "image_path": image_path,
            "creator": creator,
            "building": building,
            "schedule_definition": schedule_definition,
        }

        serializer = ScheduleWorkEntrySerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleWorkEntryApiView(APIView):
    # TODO permission_classes: list = []

    def get(self, request: Request, schedule_work_entry_id: int) -> Response:
        try:
            schedule_work_entry: ScheduleWorkEntry = ScheduleWorkEntry.objects.get(
                id=schedule_work_entry_id
            )
        except ScheduleWorkEntry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduleWorkEntrySerializer(schedule_work_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleWorkEntryByScheduleDefinitionApiView(APIView):
    # TODO permission_classes = []
    def get(self, request: Request, schedule_definition_id: int) -> Response:
        schedule_work_entries = ScheduleWorkEntry.objects.filter(
            schedule_definition=schedule_definition_id
        )
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleWorkEntryByCreatorApiView(APIView):
    # TODO permission_classes = []

    def get(self, request: Request, creator_id: int) -> Response:
        schedule_work_entries = ScheduleWorkEntry.objects.filter(creator=creator_id)
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
"""
