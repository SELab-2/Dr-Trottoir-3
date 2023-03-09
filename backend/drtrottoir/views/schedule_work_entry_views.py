from django.contrib.auth.models import AnonymousUser
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import (
    ScheduleAssignment,
    ScheduleWorkEntry,
    User,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
)
from drtrottoir.permissions import IsSuperstudentOrAdmin, user_is_student
from drtrottoir.serializers import ScheduleWorkEntrySerializer


# TODO permissions


class ScheduleWorkEntryPermission(IsSuperstudentOrAdmin):
    """
    POST permissions for the ScheduleWorkEntry API are somewhat difficult. In order for a new entry to be added,
    the post requirement has the following requirements:
    1. The user in request.user is a student or a super student
    2. The user in request.user and the request.data.creator are the same
    3. The user in request.user is in one ScheduleAssignment happening today, we will call
      this ScheduleAssignment 'schedule_assignment'
    4. The building in request.data['building'] is in schedule_assignment.schedule_definition.buildings

    If any of the conditions do not apply, the POST must fail, even if an admin or super student adds it.

    TODO some of the above conditions are not permission issues, but 400 bad request issues. The best way to fix that
     would be to override the mixins.CreateModelMixin in ScheduleWorkEntryViewSet
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "POST":
            # TODO The requirements above require the schedule assignment to be TODAY
            #  For testing purposes the date is not checked
            try:
                if isinstance(request.user, AnonymousUser):
                    # This check is hardcoded to make sure mypy is pleased
                    return False

                # Condition 1: The user in request.user is a student or super student
                condition_1 = user_is_student(request.user)

                # Condition 2: The user in request.user and the request.data.creator are the same
                condition_2 = request.user.id == request.data["creator"]

                # Condition 3: The user in request.user is in one ScheduleAssignment
                # (TODO schedule assignment should happen today)
                schedule_assignment: ScheduleAssignment = (
                    ScheduleAssignment.objects.get(user=request.user)
                )
                condition_3 = True  # If a schedule didn't exist, a ScheduleAssignment.DoesNotExist would be thrown

                # Condition 4: The building in request.data['building'] is in
                # schedule_assignment.schedule_definition.buildings
                schedule_definition: ScheduleDefinition = ScheduleDefinition(
                    pk=schedule_assignment.schedule_definition
                )
                schedule_definition_buildings = (
                    ScheduleDefinitionBuilding.objects.filter(
                        schedule_definition=schedule_definition.id
                    )
                )
                buildings = [sdb.building.id for sdb in schedule_definition_buildings]
                condition_4 = request.data["building"] in buildings
                return condition_1 and condition_2 and condition_3 and condition_4

            except AttributeError:
                return False
            except ScheduleAssignment.DoesNotExist:
                return False
            except ScheduleDefinition.DoesNotExist:
                return False
        # If not a post request, return default permissions
        return super().has_permission(request, view)


class ScheduleWorkEntryGetByIdPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            try:
                entry_creator: User = User.objects.get(id=9999)
                return entry_creator.id == request.user.id
            except ScheduleWorkEntry.DoesNotExist:
                return False
        return False


class ScheduleWorkEntryByUserIdPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        # Super students or admins always have access
        if IsSuperstudentOrAdmin().has_object_permission(request, view, None):
            return True

        if not user_is_student(request.user):
            return False
        return request.user.id == int(view.kwargs["user_id"])


class ScheduleWorkEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        (ScheduleWorkEntryPermission | ScheduleWorkEntryGetByIdPermission),
        IsAuthenticated,
    ]

    queryset = ScheduleWorkEntry.objects.all()
    serializer_class = ScheduleWorkEntrySerializer

    # Get schedule work entry by user id
    @action(
        detail=False,
        methods=["GET"],
        url_path=r"users/(?P<user_id>\w+)",
        permission_classes=[
            ScheduleWorkEntryByUserIdPermission,
            IsSuperstudentOrAdmin,
            IsAuthenticated,
        ],
    )
    def email_messages(self, request, user_id=-1):
        work_entries = ScheduleWorkEntry.objects.filter(creator=user_id)
        serializer = self.get_serializer(work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
