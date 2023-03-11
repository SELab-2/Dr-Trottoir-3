from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import mixins, permissions, viewsets
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.response import Response

from drtrottoir.models import LocationGroup
from drtrottoir.permissions import IsSuperstudentOrAdmin, user_is_superstudent_or_admin, user_is_student
from drtrottoir.serializers import (
    BuildingSerializer,
    LocationGroupSerializer,
    ScheduleDefinitionSerializer,
)
import re


class LocationGroupPermissions(permissions.BasePermission):
    """
    The GET item in ScheduleAssignment also allows students to access the entry, as
    long as that user is the same as the ScheduleAssignment's user field.
    To summarize, a user is allowed to GET an entry in ScheduleAssignment if:
    - They are an admin or a super student
    - They are a user and request.user.id == schedule_assignment.user.id
    """

    def has_permission(self, request: Request, view) -> bool:
        if request.method == "GET" and re.match("^/location_groups/[0-9]*/?$",
                                                request.get_full_path()):
            return True
        else:
            return user_is_superstudent_or_admin(request.user)


class LocationGroupViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [
        permissions.IsAuthenticated &
        LocationGroupPermissions
    ]

    queryset = LocationGroup.objects.all()
    serializer_class = LocationGroupSerializer

    @action(detail=True)
    def buildings(self, request, pk=None) -> Response:
        location_group: LocationGroup = self.get_object()
        buildings = location_group.buildings.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def schedule_definitions(self, request, pk=None) -> Response:
        location_group: LocationGroup = self.get_object()
        schedule_definitions = location_group.schedule_definitions.all()
        serializer = ScheduleDefinitionSerializer(schedule_definitions, many=True)
        return Response(serializer.data)
