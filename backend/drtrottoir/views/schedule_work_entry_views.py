from typing import Any

import rest_framework.decorators
from django.contrib.auth.models import AnonymousUser
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import (
    ScheduleAssignment,
    ScheduleDefinitionBuilding,
    ScheduleWorkEntry,
)
from drtrottoir.permissions import (
    IsSuperstudentOrAdmin,
    user_is_student,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleWorkEntrySerializer


class ScheduleWorkEntryPermission(IsSuperstudentOrAdmin):
    """Custom permission class for ScheduleWorkEntryViewSet. This permission class
    is identical to IsSuperstudentOrAdmin except that POST also grants permission
    to students.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "POST":
            return user_is_student(request.user) or user_is_superstudent_or_admin(
                request.user
            )
        # If not a post request, return default permissions
        return super().has_permission(request, view)


class ScheduleWorkEntryGetByIdPermission(permissions.BasePermission):
    """Custom permission class to allow students to also get a schedule
    work entry by id, if the work entry in question's creator is the
    same as the id of the request user:
    work_entry.creator.id==request.user.id
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            # At this point we should be authenticated because of the
            # IsAuthenticated permission class. Mypy however does not know
            # this, and we need to manually check to make sure we're not
            # AnonymousUser.
            if isinstance(request.user, AnonymousUser):
                return False
            if "pk" not in view.kwargs.keys():
                # If no ID is given, we are requesting the list. In this case,
                # refuse access
                return False
            try:
                work_entry_id = int(view.kwargs["pk"])
                work_entry = ScheduleWorkEntry.objects.get(pk=work_entry_id)
                return work_entry.creator.id == request.user.id
            except ScheduleWorkEntry.DoesNotExist:
                return False
        return False


class ScheduleWorkEntryByUserIdPermission(permissions.BasePermission):
    """Custom permission class for the retrieve_by_user_id method in
    ScheduleWorkEntryViewSet, for the `schedule_work_entries/users/<user_id>/`
    url. Allows super students and admins to GET work entries by user id, and
    students if their user id matches the request user's id:
    user_id==request.user.id

    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "GET":
            # Super students or admins always have access
            if user_is_superstudent_or_admin(request.user):
                return True
            # Students have access if request.user is the same as the user in the url
            if not user_is_student(request.user):
                return False
            user_id = int(view.kwargs["user_id"])
            return request.user.id == user_id
        return False


class ScheduleWorkEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewset of schedule work entries.

    Endpoints:

        /schedule_work_entries/
            **GET:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrHigher``

                All schedule work entries.
            **POST:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryPermission``

                Add a schedule work entry.

        /schedule_work_entries/:schedule_work_entry_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryGetByIdPermission``

                Retrieve a schedule work entry by its id.

        /schedule_work_entries/users/:user_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_work_entry_views.ScheduleWorkEntryByUserIdPermission``

                Retrieve all schedule work entries matching a user.

    """  # noqa

    permission_classes = [
        IsAuthenticated,
        (ScheduleWorkEntryPermission | ScheduleWorkEntryGetByIdPermission),
    ]

    queryset = ScheduleWorkEntry.objects.all()
    serializer_class = ScheduleWorkEntrySerializer
    parser_classes = (MultiPartParser,)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Overrides the default POST method of mixins.CreateModelMixin to add
        extra quality control to the data. Concretely, a POST method is accepted if:
            - request.user must be the same as request.data.creator
            - The user in request.user is in one ScheduleAssignment happening today
            - The building in request.data['building'] is in
              schedule_assignment.schedule_definition.buildings (or, put another way,
              there is an entry in ScheduleDefinitionBuilding where
              building=request.data.building and
              schedule_definition=request.data.schedule_definition

        If any of conditions are not valid, we return a 400_BAD_REQUEST error. If the
        given data is properly formatted, the super method is called and the
        ScheduleWorkEntry is created.

        Args:
            request (Request): The request containing the necessary fields and data.
            *args (Any): Additional args values as needed.
            **kwargs (Any): Additional kwargs values as needed.

        Returns:
            Response: A 200 response with the entry data if the data was properly
            formatted and the user had permissions. If the user didn't have permission
            a 404 response is returned. If the data is not properly formatted or the
            data is invalid, a 400 response is returned.

        """

        # At this point we've passed our permission checks, and we should
        # be authenticated. However, we need manually check if we are not
        # AnonymousUser or mypy's type checking will give errors.
        if isinstance(request.user, AnonymousUser):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Condition 1: request.user must be the same as request.data.creator
        data_creator_id = int(request.data["creator"])
        if not request.user.id == data_creator_id:
            return Response(
                {"Error": "Creator field does not match request user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Condition 2: The user in request.user is in one ScheduleAssignment
        # happening today
        # (TODO add today requirement)
        schedule_assignments = ScheduleAssignment.objects.filter(user=request.user)
        if schedule_assignments.count() == 0:
            return Response(
                {"Error": "User does not match schedule assignment"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Condition 3: The building in request.data['building'] is
        # in schedule_assignment.schedule_definition.buildings
        data_schedule_definition_id = int(request.data["schedule_definition"])
        data_building_id = int(request.data["building"])
        schedule_definition_buildings = ScheduleDefinitionBuilding.objects.filter(
            building=data_building_id, schedule_definition=data_schedule_definition_id
        )
        if schedule_definition_buildings.count() == 0:
            return Response(
                {"Error": "Building not in schedule definition"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If at this point all checks passed, POST as mixins.CreateModelMixin
        return super().create(request, *args, **kwargs)

    # Get schedule work entry by user id
    @staticmethod
    @api_view(["GET"])
    @rest_framework.decorators.permission_classes(
        [IsAuthenticated, ScheduleWorkEntryByUserIdPermission]
    )
    def retrieve_by_user_id(request, user_id):
        """Custom GET method for the url `schedule_work_entries/users/<user_id>/`.

        Args:
            request (Request): A request containing the necessary fields.
            user_id (int): The id of the user we're getting the schedule work
            entries for.

        Returns:
            Response: The response containing all the schedule work entries as
            requested, or a 404 message if the permission class doesn't allow it.

        """
        work_entries = ScheduleWorkEntry.objects.filter(creator=user_id)
        serializer = ScheduleWorkEntrySerializer(work_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
