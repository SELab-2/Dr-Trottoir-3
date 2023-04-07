from rest_framework import serializers

from drtrottoir.models import Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = "__all__"
        read_only_fields = ["resolved"]
