from drtrottoir.models import LocationGroup
from rest_framework import serializers


class LocationGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationGroup
        fields = "__all__"
