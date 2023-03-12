import re

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from drtrottoir.models import (
    Building,
    ScheduleDefinition,
    ScheduleDefinitionBuilding,
    Syndicus,
)
from drtrottoir.permissions import (
    user_is_student,
    user_is_superstudent_or_admin,
    user_is_syndicus,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    GarbageCollectionScheduleSerializer,
    GarbageCollectionScheduleTemplateSerializer,
    IssueSerializer,
    ScheduleDefinitionSerializer,
)


class BuildingPermissions(permissions.BasePermission):
    """
    Class defining the permissions for building endpoints.
    """

    def has_permission(self, request: Request, view) -> bool:
        if request.method == "GET" and re.match(
            "^/buildings/[0-9]+/$", request.get_full_path()
        ):
            #  specific building can be accessed by any authenticated user
            return True
        elif request.method == "GET" and (
            re.match("^/buildings/$", request.get_full_path())
            or re.match(
                "^/buildings/[0-9]+/garbage_collection_schedule",
                request.get_full_path(),
            )
            or re.match("^/buildings/[0-9]+/for_day", request.get_full_path())
        ):
            #  all endpoints that students can access, namely:
            #  garbage_collection_schedule_templates, garbage_collection_schedules.
            #  list of all buldings, schedules for a specific day for a building
            return user_is_student(request.user)
        elif request.method == "GET" and "user_id" in view.kwargs.keys():
            #  only the syndicus themselves can access a list of all their buildings
            #  and superstudents or admins too.
            return (
                user_is_syndicus(request.user)
                and request.user.id == int(view.kwargs["user_id"])
            ) or user_is_superstudent_or_admin(request.user)
        elif request.method == "GET" and re.match(
            "^/buildings/[0-9]+/issues/$", request.get_full_path()
        ):
            #  only the syndicus of the buidling and superstudent or admin can access
            #  this
            return (
                user_is_syndicus(request.user)
                and int(view.kwargs["pk"])
                in [
                    b["id"]
                    for b in BuildingSerializer(
                        request.user.syndicus.buildings.all(), many=True
                    ).data
                ]
            ) or user_is_superstudent_or_admin(request.user)
        else:
            return user_is_superstudent_or_admin(request.user)


class BuildingListViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewset for buildings.

    Endpoints:

        /buildings/
            **GET:**
                required permission: ``drtrottoir.models.Student``

                All buildings.
            **POST:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Add a building.

        /buildings/:building_id/
            **GET:**
                required permission: ``permissions.IsAuthenticated``

                Building of that id.
            **PATCH:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Update this building's data.
            **DELETE:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                Delete this building.

        /buildings/users/:user_id/
            **GET:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)`` or
                ``drtrottoir.model.syndicus`` if user_id is the syndicus user_id

                All the buildings from this syndicus.

        /buildings/:building_id/schedule_definitions/
            **GET:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)``

                All the schedule definitions of this building.

        /buildings/:building_id/issues/
            **GET:**
                required permission:
                ``drtrottoir.models.Student(is_super_student=True)`` or
                ``drtrottoir.model.syndicus`` if the syndicus is the syndicus of that
                building

                All the issues of this building.

        /buildings/:building_id/garbage_collection_schedule_templates/
            **GET:**
                required permission ``drtrottoir.models.Student``

                All the garbage collection schedule templates of this building.

        /buildings/:building_id/garbage_collection_schedules/
            **GET:**
                required permission ``drtrottoir.models.Student``

                All the garbage collection schedules of this building.

        /buildings/:building_id/for_day/:date/garbage_collection_schedules/
            **GET:**
                required permission ``drtrottoir.models.Student``

                All the garbage collection schedules of this building on this given day.
    """

    permission_classes = [permissions.IsAuthenticated & BuildingPermissions]

    queryset = Building.objects.all()
    serializer_class = BuildingSerializer

    @action(detail=True)
    def schedule_definitions(self, request, pk=None) -> Response:
        building_id = self.get_object().id
        schedule_buildings = ScheduleDefinitionBuilding.objects.filter(
            building=building_id
        )
        schedules = [query.schedule_definition.id for query in schedule_buildings]
        schedule_definitions = ScheduleDefinition.objects.filter(pk__in=schedules)
        serializer = ScheduleDefinitionSerializer(schedule_definitions, many=True)
        return Response(serializer.data)

    # get all buildings of syndicus with user id
    @action(detail=False, url_path=r"users/(?P<user_id>\w+)")
    def syndicus_buildings(self, request, user_id=None):
        syndicus = Syndicus.objects.get(user=user_id)
        buildings = syndicus.buildings.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def issues(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        issues = building.issues.all()
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def garbage_collection_schedule_templates(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        templates = building.garbage_collection_schedule_templates.all()
        serializer = GarbageCollectionScheduleTemplateSerializer(templates, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def garbage_collection_schedules(self, request, pk=None) -> Response:
        building: Building = self.get_object()
        schedules = building.garbage_collection_schedules.all()
        serializer = GarbageCollectionScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    @action(
        detail=True, url_path=r"for_day/(?P<date>[^/.]+)/garbage_collection_schedules"
    )
    def retrieve_garbage_collection_schedule_list_by_building_and_date(
        self, request, pk=None, date=None
    ) -> Response:
        building: Building = self.get_object()
        schedules = building.garbage_collection_schedules.filter(for_day=date)

        serializer = GarbageCollectionScheduleSerializer(schedules, many=True)
        return Response(serializer.data)
