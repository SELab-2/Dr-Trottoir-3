from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import ScheduleWorkEntry
from drtrottoir.serializers import ScheduleWorkEntrySerializer


# TODO permissions


class ScheduleWorkEntryListApiView(APIView):
    permission_classes: list = []

    def get(self, request, *args, **kwargs):
        """ """
        schedule_work_entries = ScheduleWorkEntry.objects
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ """
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
        a = serializer.errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ScheduleWorkEntryApiView(APIView):
    permission_classes: list = []

    def get(self, request, schedule_work_entry_id, *args, **kwargs):
        """"""
        try:
            schedule_work_entry: ScheduleWorkEntry = ScheduleWorkEntry.objects.get(
                id=schedule_work_entry_id
            )
        except ScheduleWorkEntry.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ScheduleWorkEntrySerializer(schedule_work_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleWorkEntryByScheduleDefinitionApiView(APIView):
    def get(self, request, schedule_definition_id, *args, **kwargs):
        """"""
        schedule_work_entries = ScheduleWorkEntry.objects.filter(
            schedule_definition=schedule_definition_id
        )
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ScheduleWorkEntryByCreatorApiView(APIView):
    def get(self, request, creator_id, *args, **kwargs):
        """"""
        schedule_work_entries = ScheduleWorkEntry.objects.filter(
            creator=creator_id
        )
        serializer = ScheduleWorkEntrySerializer(schedule_work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
