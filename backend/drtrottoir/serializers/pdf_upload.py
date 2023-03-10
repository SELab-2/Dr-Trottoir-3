from rest_framework import serializers


class PdfUploadSerializer(serializers.Serializer):
    # I set use_url to False so I don't need to pass file
    # through the url itself - defaults to True if you need it
    file = serializers.FileField(use_url=False)
