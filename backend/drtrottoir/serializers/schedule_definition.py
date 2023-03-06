from rest_framework import serializers

from drtrottoir.models import ScheduleDefinition


class ScheduleDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinition
        fields = "__all__"
