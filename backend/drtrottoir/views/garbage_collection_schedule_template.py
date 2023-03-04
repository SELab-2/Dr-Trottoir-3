from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import (
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
)
from drtrottoir.serializers import (
    GarbageCollectionScheduleTemplateEntrySerializer,
    GarbageCollectionScheduleTemplateSerializer,
)


class GarbageCollectionScheduleTemplateEntryViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageCollectionScheduleTemplateEntry.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateEntrySerializer


class GarbageCollectionScheduleTemplateViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageCollectionScheduleTemplate.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateSerializer

    @action(detail=True)
    def entries(self, request, pk=None):
        template = self.get_object()
        entries = template.entries.all()
        serializer = GarbageCollectionScheduleTemplateEntrySerializer(
            entries, many=True
        )

        return Response(serializer.data)
