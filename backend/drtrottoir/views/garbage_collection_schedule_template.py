from typing import List

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import (
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
)
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import (
    GarbageCollectionScheduleTemplateEntrySerializer,
    GarbageCollectionScheduleTemplateSerializer,
)


class GarbageCollectionScheduleTemplateEntryViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewsets that handles all routes related to garbage collection schedule
    template entries.

    Endpoints:

        /garbage_collection_schedule_template_entries/
            **POST:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Create a new entry.

        /garbage_collection_schedule_template_entries/:id/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Get information for a single entry.

            **PATCH:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Update information for a single entry.

            **DELETE:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Remove the entry with the given id.
    """  # noqa

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = GarbageCollectionScheduleTemplateEntry.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateEntrySerializer

    filterset_fields = {
        "day": ("exact", "in", "lt", "gt"),
        "garbage_type": ("exact", "in"),
        "garbage_collection_schedule_template": ("exact", "in"),
    }
    search_fields: List[str] = []


class GarbageCollectionScheduleTemplateViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewsets that handles all routes related to garbage collection schedule templates.

    Endpoints:

        /garbage_collection_schedule_templates/
            **POST:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Create a new schedule template.

        /garbage_collection_schedule_templates/:id/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Get information for a single schedule template.

            **PATCH:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Update information for a single schedule template.

            **DELETE:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Remove the schedule template with the given id.

        /garbage_collection_schedule_templates/:id/entries/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Return the schedule entries associated with the given schedule
                template.

        /garbage_collection_schedule_templates/:id/entries/days/:day/entries/
            **GET:**
                required permission: ``drtrottoir.permissions.IsSuperstudentOrAdmin``

                Return the schedule entries associated with the given schedule
                template for the given day.
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = GarbageCollectionScheduleTemplate.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateSerializer

    filterset_fields = {"building": ("exact", "in")}
    search_fields = ["name"]

    @action(detail=True)
    def entries(self, request, pk=None):
        template = self.get_object()
        entries = template.entries.all()
        serializer = GarbageCollectionScheduleTemplateEntrySerializer(
            entries, many=True
        )

        return Response(serializer.data)

    @action(detail=True, methods=["GET"], url_path=r"days/(?P<day>[0-9]+)/entries")
    def days(self, request, day, pk=None):
        template = self.get_object()
        entries = template.entries.filter(day=day)
        serializer = GarbageCollectionScheduleTemplateEntrySerializer(
            entries, many=True
        )

        return Response(serializer.data)
