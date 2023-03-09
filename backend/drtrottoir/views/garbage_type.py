from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer


class GarbageTypeViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
