from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView
from typing import Union
from drtrottoir.models import Issue

from drtrottoir.models import User


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


def user_is_syndicus(user: Union[AnonymousUser, User]) -> bool:
    return hasattr(user, "syndicus")


class IsSuperstudentOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            request.user.admin

            return True

        except ObjectDoesNotExist:
            try:
                student = request.user.student
                return student.is_super_student

            except ObjectDoesNotExist:
                return False


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
        try:
            student = request.user.student
            return student.is_super_student
        except ObjectDoesNotExist:
            try:
                request.user.admin
                return True
            except ObjectDoesNotExist:
                return False


class IsStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            request.user.student
            return True
        except ObjectDoesNotExist:
            try:
                request.user.admin
                return True
            except ObjectDoesNotExist:
                return False
            return False


class IsSyndicus(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if isinstance(request.user, AnonymousUser):
            return False
        try:
            request.user.syndicus
            return True
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
