from rest_framework import mixins, permissions, viewsets

from drtrottoir.models import GarbageCollectionSchedule
from drtrottoir.permissions import (
    IsSafeMethod,
    IsStudent,
    IsSuperstudentOrAdmin,
    IsSyndicus,
    user_is_student,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import GarbageCollectionScheduleSerializer


class GarbageCollectionScheduleViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
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
        IsSuperstudentOrAdmin | (IsSafeMethod & (IsStudent | IsSyndicus)),
    ]

    serializer_class = GarbageCollectionScheduleSerializer

    filterset_fields = {
        "for_day": ("exact", "in", "lt", "lte", "gt", "gte"),
        "building": ("exact", "in"),
        "garbage_type": ("exact", "in"),
    }
    search_fields = ["note"]

    def get_queryset(self):
        if user_is_superstudent_or_admin(self.request.user) or user_is_student(
            self.request.user
        ):
            return GarbageCollectionSchedule.objects.all()

        # Only other option is they're a syndicus
        return GarbageCollectionSchedule.objects.filter(
            building__syndici=self.request.user.syndicus
        )
