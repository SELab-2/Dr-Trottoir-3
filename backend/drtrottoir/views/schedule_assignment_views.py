from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from drtrottoir.models import ScheduleAssignment
from drtrottoir.serializers import ScheduleAssignmentSerializer

# TODO permissions


class ScheduleAssignmentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = []

    queryset = ScheduleAssignment.objects.all()
    serializer_class = ScheduleAssignmentSerializer

    def update(self, request, *args, **kwargs):
        """
        Patch only allows the user field to be updated, so this is manually overwritten.
        """
        allowed_fields = ["user"]
        filtered_data = {k: v for (k, v) in request.data.items() if k in allowed_fields}

        # Code below this point copied from UpdateModelMixin
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=filtered_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    @staticmethod
    @api_view(["GET"])
    def retrieve_list_by_date_and_user(request, assigned_date, user_id):
        schedule_assignments = ScheduleAssignment.objects.filter(
            assigned_date=assigned_date, user_id=user_id
        )
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
