from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
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
    parser_classes = (MultiPartParser, )

    # Get schedule work entry by user id
    @action(detail=False, methods=["GET"], url_path=r"users/(?P<user_id>\w+)")
    def email_messages(self, request, user_id=-1):
        work_entries = ScheduleWorkEntry.objects.filter(creator=user_id)
        serializer = self.get_serializer(work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
