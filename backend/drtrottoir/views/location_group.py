import re

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from drtrottoir.models import LocationGroup
from drtrottoir.permissions import (
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    LocationGroupSerializer,
    ScheduleDefinitionSerializer,
)


class LocationGroupPermissions(permissions.BasePermission):
    """
    Class defining the permissions for location_groups endpoints.
    """

    def has_permission(self, request: Request, view) -> bool:
        if request.method == "GET" and re.match(
            "^/location_groups/[0-9]*/?$", request.get_full_path()
        ):
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
    """
    Viewset for location groups.

    Endpoints:

        /location_groups/
            GET: (required permission `permissions.IsAuthenticated`)
                All location_groups.
            POST: (required permission `drtrottoir.models.SuperStudent`)
                Add a location group.

        /location_groups/:location_group_id/
            GET: (required permission `permissions.IsAuthenticated`)
                Location group of that id.
            PATCH: (required permission `drtrottoir.models.SuperStudent`)
                Update this location group's data.
            DELETE: (required permission `drtrottoir.models.SuperStudent`)
                Delete this location group.

        /location_groups/:location_group_id/buildings/
            GET: (required permission `drtrottoir.models.SuperStudent`)
                All the buildings that are in this location group.

        /location_groups/:location_group_id/schedule_definitions/
            GET: (required permission `drtrottoir.models.SuperStudent`)
                All the schedule definitions that are in this location group.
    """

    permission_classes = [permissions.IsAuthenticated & LocationGroupPermissions]

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
