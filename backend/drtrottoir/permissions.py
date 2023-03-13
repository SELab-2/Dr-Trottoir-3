from typing import Union

from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView

from drtrottoir.models import Issue
from drtrottoir.serializers import BuildingSerializer
from drtrottoir.models import Issue, User


def user_is_student(user: Union[AnonymousUser, User]) -> bool:
    return hasattr(user, "student")


def user_is_superstudent(user: Union[AnonymousUser, User]) -> bool:
    if not hasattr(user, "student"):
        return False
    return user.student.is_super_student


def user_is_admin(user: Union[AnonymousUser, User]) -> bool:
    return hasattr(user, "admin")


def user_is_superstudent_or_admin(user: Union[AnonymousUser, User]) -> bool:
    return user_is_superstudent(user) or user_is_admin(user)


def user_is_syndicus(user: Union[AnonymousUser, User]):
    return hasattr(user, "syndicus")


class IsSuperstudentOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return user_is_superstudent_or_admin(request.user)

    def has_permission(self, request, view):
        return user_is_superstudent_or_admin(request.user)


class IsSuperstudentOrAdminOrSafe(permissions.BasePermission):
    """
    Allow all Safe_Methods (Get, Head and Options) to be executed by every
    authenticated user. All other methods can only be executed by users with
    super_student or administrator rights.
    """

    def has_object_permission(self, request, view, obj):
        if user_is_superstudent_or_admin(request.user):
            return True
        return request.method in SAFE_METHODS

    def has_permission(self, request, view):
        if user_is_superstudent_or_admin(request.user):
            return True
        return request.method in SAFE_METHODS


class IsFromUserOfIssue(permissions.BasePermission):
    def has_object_permission(
        self, request: Request, view: APIView, obj: Issue
    ) -> bool:
        """ """
        if isinstance(request.user, AnonymousUser):
            return False
        return obj.from_user.id == request.user.id


class IsSyndicusOfBuildingAndApprovalNull(permissions.BasePermission):
    def has_object_permission(
        self, request: Request, view: APIView, obj: Issue
    ) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            return (
                len(obj.building.syndicus_set.all().filter(user=request.user)) > 0
                and obj.approval_user is None
            )
        except ObjectDoesNotExist:
            return False


class IsSyndicusOfBuildingAndApprovalNotNull(permissions.BasePermission):
    def has_object_permission(
        self, request: Request, view: APIView, obj: Issue
    ) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            return (
                len(obj.building.syndicus_set.all().filter(user=request.user)) > 0
                and obj.approval_user is not None
            )
        except ObjectDoesNotExist:
            return False


class IsSuperStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        return user_is_superstudent(request.user) or user_is_admin(request.user)


class IsStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        return user_is_student(request.user) or user_is_admin(request.user)


class IsSyndicus(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            request.user.syndicus
            return True
        except ObjectDoesNotExist:
            return False


class IsSyndicusWithUserID(permissions.BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            request.user.syndicus
            return request.user.id == int(view.kwargs["user_id"])
        except ObjectDoesNotExist:
            return False


class IsSyndicusWithBuilding(permissions.BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            request.user.syndicus
            return int(view.kwargs["pk"]) in [
                b["id"]
                for b in BuildingSerializer(
                    request.user.syndicus.buildings.all(), many=True
                ).data
            ]
        except ObjectDoesNotExist:
            return False


class IsSuperstudentOrAdminOrSafe(permissions.BasePermission):
    """
    Allow all Safe_Methods (Get, Head and Options) to be executed by every
    authenticated user. All other methods can only be executed by users with
    super_student or administrator rights.
    """

    def has_permission(self, request, view):
        try:
            request.user.admin
            return True
        except ObjectDoesNotExist:
            try:
                student = request.user.student
                if student.is_super_student:
                    return True
                return request.method in SAFE_METHODS

            except ObjectDoesNotExist:
                return False
        return user_is_syndicus(request.user)


class HasAssignmentForScheduleDefinition(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(request.user, AnonymousUser):
            return False
        if any(
            assignment in request.user.assignments.all()
            for assignment in obj.assignments.all()
        ):
            return True
        else:
            try:
                request.user.admin

                return True

            except ObjectDoesNotExist:
                try:
                    student = request.user.student
                    return student.is_super_student

                except ObjectDoesNotExist:
                    return False
