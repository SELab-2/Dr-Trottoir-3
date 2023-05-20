from typing import List

import django_filters
from django.db.models import Count, F
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drtrottoir.models import ScheduleAssignment
from drtrottoir.permissions import (
    IsStudent,
    IsSuperstudentOrAdmin,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import ScheduleAssignmentSerializer

from .mixins import PermissionsByActionMixin


class ScheduleAssignmentFilter(django_filters.FilterSet):
    buildings_count = django_filters.NumberFilter()

    buildings_to_do = django_filters.NumberFilter()
    buildings_to_do__gt = django_filters.NumberFilter(
        field_name="buildings_to_do", lookup_expr="gt"
    )
    buildings_to_do__lt = django_filters.NumberFilter(
        field_name="buildings_to_do", lookup_expr="lt"
    )

    buildings_done = django_filters.NumberFilter()
    buildings_done__gt = django_filters.NumberFilter(
        field_name="buildings_done", lookup_expr="gt"
    )
    buildings_done__lt = django_filters.NumberFilter(
        field_name="buildings_done", lookup_expr="lt"
    )

    buildings_percentage = django_filters.NumberFilter()
    buildings_percentage__gt = django_filters.NumberFilter(
        field_name="buildings_percentage", lookup_expr="gt"
    )
    buildings_percentage__lt = django_filters.NumberFilter(
        field_name="buildings_percentage", lookup_expr="lt"
    )

    class Meta:
        model = ScheduleAssignment

        fields = {
            "assigned_date": ("exact", "in", "gt", "lt"),
            "schedule_definition": ("exact", "in"),
            "user": ("exact", "in"),
            "schedule_definition__location_group": ("exact", "in"),
        }


class ScheduleAssignmentViewSet(PermissionsByActionMixin, viewsets.ModelViewSet):
    """
    Viewset for schedule assignments.
    Endpoints:
        /schedule_assignments/
            **POST:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Add a schedule assignment.
        /schedule_assignments/:schedule_assignment_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_assignment_views.ScheduleAssignmentPermission | drtrottoir.permissions.IsSuperstudentOrAdmin``
                Retrieve a schedule assignment by id.
            **PATCH:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Update this schedule assignment's data.
            **DELETE:**
                required permission:
                ``drtrottoir.permissions.IsSuperstudentOrAdmin``
                Delete this schedule assignment.
        /schedule_assignments/date/:assigned_date/user/:user_id/
            **GET:**
                required permission:
                ``drtrottoir.views.schedule_assignment_views.ScheduleAssignmentByDateAndUserPermission``
                Retrieve all schedule assignments on the given date assigned to given user.
    """  # noqa

    serializer_class = ScheduleAssignmentSerializer
    filterset_class = ScheduleAssignmentFilter

    permission_classes = [IsAuthenticated, IsSuperstudentOrAdmin]
    permission_classes_by_action = {
        "retrieve": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "list": [IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
    }

    search_fields: List[str] = [
        "schedule_definition__name",
        "user__username",
        "user__first_name",
        "user__last_name",
    ]

    ordering_fields: List[str] = [
        "schedule_definition__name",
        "schedule_definition__location_group__name",
        "user__username",
    ]

    def get_queryset(self):
        """
        Admins and superstudents can access all schedule assignments, while
        regular users can only see their own.
        """
        if user_is_superstudent_or_admin(self.request.user):
            queryset = ScheduleAssignment.objects.all()

        else:
            queryset = ScheduleAssignment.objects.filter(user=self.request.user.id)

        queryset = queryset.annotate(
            buildings_count=Count("schedule_definition__buildings", distinct=True),
            buildings_done=Count("work_entries__building", distinct=True),
            buildings_to_do=F("buildings_count") - F("buildings_done"),
            buildings_percentage=F("buildings_done") * 100 / F("buildings_count"),
        )

        return queryset

    def update(self, *args, **kwargs):
        schedule_assignment = self.get_object()

        if schedule_assignment.work_entries.count() > 0:
            return Response(
                "You cannot edit schedule assignments with related work entries.",
                status=400,
            )

        return super().update(*args, **kwargs)

    def partial_update(self, *args, **kwargs):
        schedule_assignment = self.get_object()

        if schedule_assignment.work_entries.count() > 0:
            return Response(
                "You cannot edit schedule assignments with related work entries.",
                status=400,
            )

        return super().partial_update(*args, **kwargs)

    def destroy(self, *args, **kwargs):
        schedule_assignment = self.get_object()

        if schedule_assignment.work_entries.count() > 0:
            return Response(
                "You cannot schedule assignments with related work entries.",
                status=400,
            )

        return super().destroy(*args, **kwargs)
