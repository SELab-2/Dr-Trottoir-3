from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions


class IsSuperstudentOrAdmin(permissions.BasePermission):
from typing import Any

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions

from drtrottoir.models import User


class IsSuperStudentOrAdmin(permissions.BasePermission):
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
        except AttributeError:
            return False


def user_is_student(user: Any) -> bool:
    try:
        user.student
        return True
    except ObjectDoesNotExist:
        return False
    except AttributeError:
        return False
