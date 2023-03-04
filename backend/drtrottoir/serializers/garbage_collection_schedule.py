from rest_framework import serializers

from drtrottoir.models import GarbageCollectionSchedule


class GarbageCollectionScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageCollectionSchedule
        fields = "__all__"
