from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.permissions import IsSuperstudentOrAdminOrSafe
from drtrottoir.serializers import GarbageTypeSerializer


class GarbageTypeViewSet(ModelViewSet):
    """
    Viewset for garbage types

    Endpoints:

        /garbage_types/
            **GET:**
                required permission: ``drtrottoir.models.Student``

                All garbage types.
            **POST:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Create a new garbage type, return newly created object.

        /garbage_types/garbage_type_id/
            **GET:**
                required permission: ``drtrottoir.models.Student``

                Get the garbage type object with the given ID.
            **PATCH:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Update the name of the garbage type.
            **DELETE:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Delete the garbage type. Only if no objects are linked to this garbage
                type.
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdminOrSafe]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
