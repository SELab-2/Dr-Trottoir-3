from rest_framework import serializers

from backend.drtrottoir.models import Issue


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'