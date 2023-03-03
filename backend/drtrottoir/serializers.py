from rest_framework import serializers

from drtrottoir.models import GarbageCollectionScheduleTemplateEntry, GarbageCollectionScheduleTemplate


class GarbageCollectionScheduleTemplateEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageCollectionScheduleTemplateEntry
        fields = "__all__"


class GarbageCollectionScheduleTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GarbageCollectionScheduleTemplate
        fields = "__all__"
