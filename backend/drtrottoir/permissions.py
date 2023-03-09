from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions


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
