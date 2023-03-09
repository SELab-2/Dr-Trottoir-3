from django.core.exceptions import ObjectDoesNotExist
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir import models
from drtrottoir.models import ScheduleAssignment, Student
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import ScheduleAssignmentSerializer

# TODO permissions


class ScheduleAssignmentPermission(permissions.BasePermission):
    """
    ScheduleAssignment has a special case for accessing a schedule
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            if isinstance(request.user, models.User):
                student = request.user.student
            else:
                return False
            schedule_assignment_id = int(view.kwargs["pk"])
            try:
                schedule_assignment = ScheduleAssignment.objects.get(
                    pk=schedule_assignment_id
                )
            except ScheduleAssignment.DoesNotExist:
                return False
            return schedule_assignment.user.id == student.user.id
        return False


class ScheduleAssignmentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ScheduleAssignment.objects.all()
    serializer_class = ScheduleAssignmentSerializer

    permission_classes = [
        (ScheduleAssignmentPermission | IsSuperstudentOrAdmin),
        permissions.IsAuthenticated,
    ]

    def update(self, request, *args, **kwargs):
        """
        Patch only allows the user field to be updated, so this is manually overwritten.

        TODO replace this with read_only_fields
        For the moment I've tried using read_only_fields, but I get some
        Assertion sql errors. I don't know why yet, but I'm looking into it
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
        # Permissions:
        # A user is allowed to access the resources if:
        # - They are an admin or a super student
        # - They are a student and the student's user.id is the same as user_id

        # Check if admin or super student

        user_is_admin_or_super_student = IsSuperstudentOrAdmin().has_object_permission(
            request, ScheduleAssignment, None
        )
        try:
            request_id = request.user.id
            request_student = Student.objects.get(user=request_id)
            user_is_student_and_id_matches = request_student.id == user_id
        except ObjectDoesNotExist:
            user_is_student_and_id_matches = False
        except AttributeError:
            user_is_student_and_id_matches = False

        if not (user_is_admin_or_super_student or user_is_student_and_id_matches):
            return Response(status=status.HTTP_404_NOT_FOUND)

        # If permission is granted, return the objects
        schedule_assignments = ScheduleAssignment.objects.filter(
            assigned_date=assigned_date, user_id=user_id
        )
        serializer = ScheduleAssignmentSerializer(schedule_assignments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
