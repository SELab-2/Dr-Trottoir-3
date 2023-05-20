from rest_framework import serializers

from drtrottoir.models import ScheduleAssignment


class ScheduleAssignmentSerializer(serializers.ModelSerializer):
    buildings_count = serializers.IntegerField(read_only=True)
    buildings_done = serializers.IntegerField(read_only=True)
    buildings_to_do = serializers.IntegerField(read_only=True)
    buildings_percentage = serializers.IntegerField(read_only=True)

    class Meta:
        model = ScheduleAssignment
        fields = "__all__"
