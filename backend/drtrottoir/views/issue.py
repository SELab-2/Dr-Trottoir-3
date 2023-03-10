from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.models import Issue
from drtrottoir.permissions import IsSuperstudentOrAdmin, IsSuperStudent, IsSyndicusOfBuildingAndApprovalNull, \
    IsFromUserOfIssue
from drtrottoir.serializers import IssueSerializer

# TODO - maybe move logic implemented in views to ViewSet.
# class IssueCreateListRetrieveDestroyViewSet(
#     mixins.CreateModelMixin,
#     mixins.ListModelMixin,
#     mixins.RetrieveModelMixin,
#     viewsets.GenericViewSet,
# ):
#     permission_classes = []
#
#     queryset = Issue.objects.all()
#     serializer_class = IssueSerializer

# class IssueViewSet(ModelViewSet):
#     permission_classes = []
#
#     queryset = Issue.objects.all()
#     serializer_class = IssueSerializer


class IssuesListApiView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """ """
        issues = Issue.objects
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ """
        request_user = request.user

        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        request.data["from_user"] = request_user.id

        serializer = IssueSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueDetailApiView(APIView):
    # permission_classes = [IsAuthenticated, IsFromUserOfIssue]

    @permission_classes([IsAuthenticated, IsSuperStudent])
    def get(self, request, issue_id, *args, **kwargs):
        """ """
        try:
            instance = Issue.objects.get(id=issue_id)

            if not IsFromUserOfIssue().has_object_permission(request, None, instance) and not IsSyndicusOfBuildingAndApprovalNull().has_object_permission(request, None, instance) and not IsSuperStudent().has_permission(request, None):
                return Response(status=status.HTTP_403_FORBIDDEN)

            serializer = IssueSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Issue.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )

    @permission_classes([IsAuthenticated, IsSuperStudent])
    def patch(self, request, issue_id, *args, **kwargs):
        """ """
        try:
            instance = Issue.objects.get(id=issue_id)
            serializer = IssueSerializer(instance, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Issue.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request, issue_id, *args, **kwargs):
        """ """
        try:
            instance = Issue.objects.get(id=issue_id)
            serializer = IssueSerializer(
                instance, data={"resolved": True}, partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Issue.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )


class IssueNotApprovedApiView(APIView):
    def get(self, request, *args, **kwargs):
        """ """
        issues = Issue.objects.filter(approval_user=None)
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

