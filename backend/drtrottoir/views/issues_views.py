from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from drtrottoir.serializers import IssueSerializer
from drtrottoir.models import Issue, Building


class IssueViewSet(ModelViewSet):
    permission_classes = []

    queryset = Issue.objects.all()
    serializer_class = IssueSerializer



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


class IssueDetailApiView(APIView):
    def get(self, request, issue_id, *args, **kwargs):
        """

        """
        try:
            instance = Issue.objects.get(id=issue_id)
            serializer = IssueSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Issue.DoesNotExist:
            return Response(
                {"res": "Object with id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, issue_id, *args, **kwargs):
        """

        """
        instance = Issue.objects.get(id=issue_id)

        if instance is None:
            return Response(
                {"res": "Object with id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = IssueSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, issue_id, *args, **kwargs):
        """

        """
        instance = Issue.objects.get(id=issue_id)

        if instance is None:
            return Response(
                {"res": "Object with id does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )

        instance.delete()

        return Response(
            {"res": "Object deleted"},
            status=status.HTTP_200_OK
        )


class IssueBuildingApiView(APIView):
    def get(self, request, building_id, *args, **kwargs):
        """

        """



class IssueNotApprovedApiView(APIView):
    def get(self, request, *args, **kwargs):
        """

        """
