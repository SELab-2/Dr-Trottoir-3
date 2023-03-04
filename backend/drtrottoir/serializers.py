from rest_framework import serializers

from drtrottoir.models import LocationGroup, Building, Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = "__all__"
