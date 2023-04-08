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
    """
    Viewset handling issue images.

    Endpoints:
        /issue_images/
            **POST:**
               required permission: ``drtrottoir.models.Student``
                Create a new issue image and upload an image, return newly created object.
                Request format: 'multipart'.

        /issues_images/:issue_image_id/
            **GET:**
               required permission: ``drtrottoir.models.Student(is_super_student=True)``

            **DELETE:**
               required permission: ``drtrottoir.models.Student(is_super_student=True)``
                Create a new issue image and upload an image, return newly created object.
                Request format: 'multipart'.
    """  # noqa

    parser_classes = (MultiPartParser,)
    serializer_class = IssueImageSerializer
    queryset = IssueImage.objects.all()

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "create": [permissions.IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "destroy": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
    }
