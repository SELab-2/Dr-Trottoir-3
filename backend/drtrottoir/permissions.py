from typing import Union

from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView

from drtrottoir.models import Issue, User
from drtrottoir.serializers import BuildingSerializer


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
    def has_permission(self, request, view):
        return user_is_superstudent_or_admin(request.user)


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
        buildings = obj.building.syndici.all().filter(user=request.user)
        approval = obj.approval_user
        return len(buildings) > 0 and approval is None


class IsSyndicusOfBuildingAndApprovalNotNull(permissions.BasePermission):
    def has_object_permission(
        self, request: Request, view: APIView, obj: Issue
    ) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        buildings = obj.building.syndici.all().filter(user=request.user)
        approval = obj.approval_user
        return len(buildings) > 0 and approval is not None


class IsSuperStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return user_is_superstudent(request.user) or user_is_admin(request.user)


class IsStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        return user_is_student(request.user) or user_is_admin(request.user)


class IsSyndicus(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return user_is_syndicus(request.user)


class IsSyndicusWithUserID(permissions.BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        if not user_is_syndicus(request.user):
            return False
        return request.user.id == int(view.kwargs["user_id"])


class IsSyndicusWithBuilding(permissions.BasePermission):
    def has_permission(self, request: Request, view) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        if not user_is_syndicus(request.user):
            return False

        return int(view.kwargs["pk"]) in [
            b["id"]
            for b in BuildingSerializer(
                request.user.syndicus.buildings.all(), many=True
            ).data
        ]


class IsSuperstudentOrAdminOrSafe(permissions.BasePermission):
    """
    Allow all Safe_Methods (Get, Head and Options) to be executed by every
    authenticated user. All other methods can only be executed by users with
    super_student or administrator rights.
    """

    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        if user_is_superstudent_or_admin(request.user):
            return True
        return request.method in SAFE_METHODS


class IsSafeMethod(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsSafeMethodAndUserIsStudentOrHigher(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        safe = request.method in SAFE_METHODS
        student = user_is_student(request.user)
        higher = user_is_superstudent_or_admin(request.user)
        return safe and (student or higher)


class HasAssignmentForScheduleDefinition(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(request.user, AnonymousUser):
            return False
        if any(
            assignment in request.user.assignments.all()
            for assignment in obj.assignments.all()
        ):
            return True
        return user_is_superstudent_or_admin(request.user)
