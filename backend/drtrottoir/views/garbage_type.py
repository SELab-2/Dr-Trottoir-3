from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer
from rest_framework import permissions


class GarbageTypeViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
