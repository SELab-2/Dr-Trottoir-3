from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer
from drtrottoir.permissions import IsSuperstudentOrAdminOrSafe


class GarbageTypeViewSet(ModelViewSet):

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdminOrSafe]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
