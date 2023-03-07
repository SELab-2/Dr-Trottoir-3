from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import (
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
)
from drtrottoir.serializers import (
    GarbageCollectionScheduleTemplateEntrySerializer,
    GarbageCollectionScheduleTemplateSerializer,
)


class GarbageCollectionScheduleTemplateEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = []

    queryset = GarbageCollectionScheduleTemplateEntry.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateEntrySerializer


class GarbageCollectionScheduleTemplateViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
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
