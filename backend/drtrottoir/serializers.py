from rest_framework import serializers

from drtrottoir.models import (
    Building,
    Issue,
    LocationGroup,
    ScheduleAssignment,
    ScheduleDefinition,
    ScheduleWorkEntry,
)


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = "__all__"


class LocationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationGroup
        fields = "__all__"


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"


class ScheduleDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinition
        fields = "__all__"


class ScheduleAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleAssignment
        fields = "__all__"


class ScheduleWorkEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleWorkEntry
        fields = "__all__"
