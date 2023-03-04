from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import (
    GarbageCollectionSchedule,
)
from drtrottoir.serializers import (
    GarbageCollectionScheduleSerializer,
)


class GarbageCollectionScheduleViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageCollectionSchedule.objects.all()
    serializer_class = GarbageCollectionScheduleSerializer
