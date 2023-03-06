from rest_framework import serializers

from drtrottoir.models import LocationGroup


class LocationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationGroup
        fields = "__all__"
