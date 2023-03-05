from drtrottoir.models import Building, ScheduleDefinitionBuilding
from rest_framework import serializers


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"


class ScheduleDefinitionBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinitionBuilding
        fields = "__all__"
