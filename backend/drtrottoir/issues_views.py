from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.serializers import IssueSerializer
from drtrottoir.models import Issue, Building


class IssuesListApiView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """

        """
        issues = Issue.objects
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """

        """
        request_user = request.user

        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO - check user permissions

        building_id = request.data.get('building_id')
        # building_instance = Building.objects.get(id=building_id)

        data = {
            'building': building_id,
            'message': request.data.get('message'),
            'from_user': request_user.id
        }

        serializer = IssueSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
