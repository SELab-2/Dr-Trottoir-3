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
