from rest_framework import mixins, permissions, viewsets

from drtrottoir.models import ScheduleDefinition
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import ScheduleDefinitionSerializer


class ScheduleDefinitionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = ScheduleDefinition.objects.all()
    serializer_class = ScheduleDefinitionSerializer
