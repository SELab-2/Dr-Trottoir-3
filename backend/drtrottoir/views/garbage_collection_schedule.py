from rest_framework import mixins, permissions, viewsets

from drtrottoir.models import GarbageCollectionSchedule
from drtrottoir.permissions import (
    IsSafeMethodAndUserIsStudentOrHigher,
    IsSuperstudentOrAdmin,
)
from drtrottoir.serializers import GarbageCollectionScheduleSerializer


class GarbageCollectionScheduleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewset for garbage collection schedule.

    Endpoints:

        /garbage_collection_schedules/
            **POST:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``

                Add a garbage collection schedule.

        /garbage_collection_schedules/:garbage_collection_schedule_id/
            **GET:**
                required permission: ``drtrottoir.models.Student``

                Garbage collection schedule of that id.
            **PATCH:**
                required permission ``drtrottoir.models.Student(is_super_student=True)``

                Update this garbage collection schedule's data.
            **DELETE:**
                required permission ``drtrottoir.models.Student(is_super_student=True)``

                Delete this garbage collection schedule.
    """  # noqa

    permission_classes = [
        permissions.IsAuthenticated,
        (IsSuperstudentOrAdmin | IsSafeMethodAndUserIsStudentOrHigher),
    ]

    queryset = GarbageCollectionSchedule.objects.all()
    serializer_class = GarbageCollectionScheduleSerializer

    filterset_fields = ["for_day", "building", "garbage_type"]
    search_fields = ["note"]
