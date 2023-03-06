from rest_framework import serializers

from drtrottoir.models import ScheduleWorkEntry


class ScheduleWorkEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleWorkEntry
        fields = "__all__"
