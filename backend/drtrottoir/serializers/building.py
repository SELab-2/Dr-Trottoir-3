from rest_framework import serializers

from drtrottoir.models import Building, ScheduleDefinitionBuilding


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"
        read_only_fields = ["secret_link"]


class ScheduleDefinitionBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinitionBuilding
        fields = ["building", "position"]
