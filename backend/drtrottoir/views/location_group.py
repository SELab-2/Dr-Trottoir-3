from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import LocationGroup
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import (
    BuildingSerializer,
    LocationGroupSerializer,
    ScheduleDefinitionSerializer,
)


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
            **GET:**
                required permission: ``permissions.IsAuthenticated``

                All location_groups.
            **POST:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Add a location group.

        /location_groups/:location_group_id/
            **GET:**
                required permission: ``permissions.IsAuthenticated``

                Location group of that id.
            **PATCH:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Update this location group's data.
            **DELETE:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Delete this location group.

        /location_groups/:location_group_id/buildings/
            **GET:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                All the buildings that are in this location group.

        /location_groups/:location_group_id/schedule_definitions/
            **GET:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                All the schedule definitions that are in this location group.
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [permissions.IsAuthenticated],
        "list": [permissions.IsAuthenticated],
    }

    def get_permissions(self):
        if self.action not in self.permission_classes_by_action:
            return [perm() for perm in self.permission_classes]

        return [perm() for perm in self.permission_classes_by_action[self.action]]

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
