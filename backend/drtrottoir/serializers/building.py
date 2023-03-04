from drtrottoir.models import Building
from rest_framework import serializers


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = "__all__"
