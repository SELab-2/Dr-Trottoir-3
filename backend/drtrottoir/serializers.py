from rest_framework import serializers

from drtrottoir.models import LocationGroup, Building, Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'


class LocationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationGroup
        fields = '__all__'


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'
