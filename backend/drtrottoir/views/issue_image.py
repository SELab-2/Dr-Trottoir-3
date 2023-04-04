from rest_framework import mixins, permissions, viewsets
from rest_framework.parsers import MultiPartParser

from drtrottoir.models import IssueImage
from drtrottoir.permissions import IsStudent, IsSuperstudentOrAdmin
from drtrottoir.serializers import IssueImageSerializer

from .mixins import PermissionsByActionMixin


class IssueImageViewSet(
    PermissionsByActionMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    parser_classes = (MultiPartParser,)
    serializer_class = IssueImageSerializer
    queryset = IssueImage.objects.all()

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "create": [permissions.IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "destroy": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
    }
