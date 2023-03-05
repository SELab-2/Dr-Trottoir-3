from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer


class GarbageTypeViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
