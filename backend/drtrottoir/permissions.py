from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class IsSuperstudentOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            request.user.admin

            return True

        except ObjectDoesNotExist:
            try:
                student = request.user.student
                return student.is_super_student

            except ObjectDoesNotExist:
                return False


class IsSuperstudentOrAdminOrSafe(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
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


class HasAssignmentForScheduleDefinition(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
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
