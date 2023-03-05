from rest_framework import serializers

from drtrottoir.models import IssueImage


class IssueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueImage
        fields = "__all__"
