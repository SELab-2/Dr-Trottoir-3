from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import GarbageType
from drtrottoir.permissions import IsSuperstudentOrAdminOrSafe
from drtrottoir.serializers.garbage_type import GarbageTypeSerializer


class GarbageTypeViewSet(ModelViewSet):
    """
    /garbage_types/
	* GET: (permission student)
        All garbage types
	* POST: (permission super_student)
	    Create a new garbage type, return newly created object.
    /garbage_types/:garbage_type_id/
	* GET: (permission student)
	    Get the garbage type object with the given ID.
	* PATCH: (permission super_student)
	    Update the name of the garbage type.
	* DELETE: (permission super_student)
	    Delete the garbage type. Only possible if no objects are linked to this garbage type.
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdminOrSafe]

    queryset = GarbageType.objects.all()
    serializer_class = GarbageTypeSerializer
