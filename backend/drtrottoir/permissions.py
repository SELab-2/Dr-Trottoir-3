from typing import Any

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.views import APIView

from drtrottoir.models import Issue


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
    def has_object_permission(self, request: Request, view: APIView, obj: Issue) -> bool:
        """

        """
        return obj.from_user.id == request.user.id


class IsSyndicusOfBuildingAndApprovalNull(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Issue) -> bool:
        """

        """
        try:
            return request.user.syndicus in obj.building.syndicus_set and obj.approval_user is None
        except ObjectDoesNotExist:
            return False


class IsSuperStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        try:
            student = request.user.student
            return student.is_super_student
        except ObjectDoesNotExist:
            return False


class IsStudent(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        try:
            request.user.student
            return True
        except ObjectDoesNotExist:
            return False


class IsSyndicus(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        """

        """
        try:
            request.user.syndicus
            return True
        except ObjectDoesNotExist:
            return False
