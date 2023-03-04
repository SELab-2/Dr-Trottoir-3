from rest_framework import serializers

from drtrottoir.models import GarbageType


class GarbageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageType
        fields = '__all__'