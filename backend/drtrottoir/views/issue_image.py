from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import IssueImage
from drtrottoir.serializers import IssueImageSerializer


class IssueImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        """ """
        posts = IssueImage.objects.all()
        serializer = IssueImageSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """ """
        serializer = IssueImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueImageDetailView(APIView):
    """
    The files are not allowed to be deleted, only the entries from the database.
    The uploaded files are accessible at /media/issue_images/{filename}/
    """

    def get(self, request, issue_image_id, *args, **kwargs):
        try:
            instance = IssueImage.objects.get(id=issue_image_id)
            serializer = IssueImageSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except IssueImage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, issue_image_id, *args, **kwargs):
        """ """
        try:
            instance = IssueImage.objects.get(id=issue_image_id)
            instance.delete()
            return Response(status=status.HTTP_200_OK)
        except IssueImage.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )
