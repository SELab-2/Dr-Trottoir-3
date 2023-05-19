from rest_framework import serializers

from drtrottoir.models import Building, ScheduleDefinitionBuilding

from .schedule_work_entry import ScheduleWorkEntrySerializer


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
            "secret_link"
        ]
        read_only_fields = ["secret_link"]


class ScheduleDefinitionBuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleDefinitionBuilding
        fields = ["building", "position"]


class PublicBuildingSerializer(serializers.ModelSerializer):
    schedule_work_entries = ScheduleWorkEntrySerializer(many=True)

    class Meta:
        model = Building
        fields = [
            "name",
            "address",
            "description",
            "image",
            "longitude",
            "latitude",
            "schedule_work_entries"
        ]
