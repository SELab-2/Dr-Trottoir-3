from rest_framework import serializers

from drtrottoir.models import Building, ScheduleDefinitionBuilding


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = [
            "id",
            "name",
            "address",
            "pdf_guide",
            "location_group",
            "is_active",
            "description",
            "image",
            "longitude",
            "latitude",
            "syndici",
        ]


class ScheduleDefinitionBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinitionBuilding
        fields = ["building", "position"]
