from rest_framework.viewsets import ModelViewSet

from drtrottoir.serializers.garbage_type import GarbageTypeSerializer
from drtrottoir.models import GarbageType


class GarbageTypeViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
