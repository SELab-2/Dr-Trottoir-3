from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import IssueImage
from drtrottoir.permissions import IsStudent, IsSuperStudent
from drtrottoir.serializers import IssueImageSerializer


class IssueImageView(APIView):
    parser_classes = (MultiPartParser,)
    # Code removed on March 11 2023, since it does not follow the API guide.
    # def get(self, request, *args, **kwargs):
    #     """ """
    #     # if not IsAuthenticated().has_permission(request, None)
    #          or not IsStudent().has_permission(request, None):
    #     #     return Response(status=status.HTTP_403_FORBIDDEN)
    #     posts = IssueImage.objects.all()
    #     serializer = IssueImageSerializer(posts, many=True)
    #     return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        """ """
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = IssueImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueImageDetailView(APIView):
    """
    The files are not allowed to be deleted, only the entries from the database.
    The uploaded files are accessible at /media/issue_images/{filename}/
    """

    # Code removed on March 11 2023, since it does not follow the API guide.
    # def get(self, request, issue_image_id, *args, **kwargs):
    #     try:
    #         instance = IssueImage.objects.get(id=issue_image_id)
    #         serializer = IssueImageSerializer(instance)
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     except IssueImage.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, issue_image_id, *args, **kwargs):
        """ """
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsSuperStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        try:
            instance = IssueImage.objects.get(id=issue_image_id)
            instance.delete()
            return Response(status=status.HTTP_200_OK)
        except IssueImage.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )