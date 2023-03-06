from rest_framework import serializers

from drtrottoir.models import Building, ScheduleDefinitionBuilding


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"


class ScheduleDefinitionBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinitionBuilding
        fields = "__all__"
