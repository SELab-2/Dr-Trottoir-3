from rest_framework import serializers

from drtrottoir.models import ScheduleAssignment


class ScheduleAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleAssignment
        fields = "__all__"
