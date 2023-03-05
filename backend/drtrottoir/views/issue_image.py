from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser

from drtrottoir.models import IssueImage
from drtrottoir.serializers import IssueImageSerializer


class IssueImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        """

        """
        posts = IssueImage.objects.all()
        serializer = IssueImageSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """

        """
        serializer = IssueImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueImageDetailView(APIView):
    def delete(self, request, *args, **kwargs):
        """

        """
        posts = IssueImage.objects.all()
        serializer = IssueImageSerializer(posts, many=True)
        return Response(serializer.data)
