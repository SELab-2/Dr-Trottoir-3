from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.permissions import IsSuperstudentOrAdminOrSafe
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer


class GarbageTypeViewSet(ModelViewSet):
    """
    :views:`drtrottoir.views.garbage_type.GarbageTypeViewSet`
    Displays a list of all objects of type :model:`drtrottoir.models.GarbageType`.

    Example:
        All objects: :template:`drtrottoir/garbage_type`
        Specific object: :template:`drtrottoir/garbage_type/{object_id}`

    Authentication:
        :path: /garbage_types/
        GET (required permission `drtrottoir.models.Student`):
            All garbage types.
        POST (required permission `drtrottoir.models.Student(is_super_student=True)`):
            Create a new garbage type, return newly created object.

        :path: /garbage_types/garbage_type_id/
        GET (required permission `drtrottoir.models.Student`):
            Get the garbage type object with the given ID.
        PATCH (required permission `drtrottoir.models.Student(is_super_student=True)`):
            Update the name of the garbage type.
        DELETE (required permission `drtrottoir.models.Student(is_super_student=True)`):
            Delete the garbage type. Only if no objects are linked to this garbage type.
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdminOrSafe]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
