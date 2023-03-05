from drtrottoir.models import ScheduleDefinition
from rest_framework import serializers


class ScheduleDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinition
        fields = "__all__"
