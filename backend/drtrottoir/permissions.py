from typing import Union

from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS

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


class IsSuperstudentOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return user_is_superstudent_or_admin(request.user)

    def has_permission(self, request, view):
        return user_is_superstudent_or_admin(request.user)


class IsSuperstudentOrAdminOrSafe(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if user_is_superstudent_or_admin(request.user):
            return True
        return request.method in SAFE_METHODS

    def has_permission(self, request, view):
        if user_is_superstudent_or_admin(request.user):
            return True
        return request.method in SAFE_METHODS
