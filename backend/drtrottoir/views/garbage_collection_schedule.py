from rest_framework import mixins, viewsets

from drtrottoir.models import GarbageCollectionSchedule
from drtrottoir.serializers import GarbageCollectionScheduleSerializer


class GarbageCollectionScheduleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = []

    queryset = GarbageCollectionSchedule.objects.all()
    serializer_class = GarbageCollectionScheduleSerializer
