from rest_framework import mixins, permissions, viewsets

from drtrottoir.models import GarbageCollectionSchedule
from drtrottoir.permissions import IsSuperstudentOrAdminOrSafe
from drtrottoir.serializers import GarbageCollectionScheduleSerializer


class GarbageCollectionScheduleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdminOrSafe]

    queryset = GarbageCollectionSchedule.objects.all()
    serializer_class = GarbageCollectionScheduleSerializer
