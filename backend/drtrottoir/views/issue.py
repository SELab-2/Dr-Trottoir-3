from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from drtrottoir.models import Issue
from drtrottoir.permissions import (
    IsFromUserOfIssue,
    IsStudent,
    IsSuperStudent,
    IsSuperstudentOrAdmin,
    IsSyndicus,
    IsSyndicusOfBuildingAndApprovalNotNull,
    IsSyndicusOfBuildingAndApprovalNull,
    user_is_superstudent_or_admin,
    user_is_syndicus,
)
from drtrottoir.serializers import IssueSerializer

from .mixins import PermissionsByActionMixin


class IssueViewSet(PermissionsByActionMixin, viewsets.ModelViewSet):
    serializer_class = IssueSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsStudent | IsSuperstudentOrAdmin | IsSyndicus,
    ]
    permission_classes_by_action = {
        "create": [permissions.IsAuthenticated, IsStudent | IsSuperstudentOrAdmin],
        "update": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
        "partial_update": [permissions.IsAuthenticated, IsSuperstudentOrAdmin],
        "destroy": [
            permissions.IsAuthenticated,
            IsSuperstudentOrAdmin | IsSyndicusOfBuildingAndApprovalNotNull,
        ],
    }

    filterset_fields = ["building", "resolved", "from_user", "approval_user"]
    search_fields = ["message"]

    def get_queryset(self):
        """
        Syndici can see the list of issues from buildings they own. Students
        can see the list of issues they've created.
        """
        if user_is_superstudent_or_admin(self.request.user):
            return Issue.objects.all()

        elif user_is_syndicus(self.request.user):
            return Issue.objects.filter(building__syndici=self.request.user.syndicus)

        # Only other option is a regular student
        else:
            return Issue.objects.filter(from_user=self.request.user)

    def create(self, request, *args, **kwargs):
        request.data["from_user"] = request.user.id

        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        issue = self.get_object()
        issue.resolved = True
        issue.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False)
    def not_approved(self, request):
        issues = self.filter_queryset(self.get_queryset().filter(approval_user=None))
        serializer = self.get_serializer_class()(
            self.paginate_queryset(issues), many=True
        )
        return self.get_paginated_response(serializer.data)


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


class IssuesListApiView(GenericAPIView):
    """The list endpoint for the issue object.

    Endpoints:

        /issues/
            **GET:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``

                All issues.
            **POST:**
                required permission: ``drtrottoir.models.Student``

                Create a new issue type, return newly created object.
    """  # noqa

    def get(self, request, *args, **kwargs):
        """ """
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsSuperStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        issues = self.paginate_queryset(Issue.objects.all())
        serializer = IssueSerializer(issues, many=True)
        return self.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        request_user = request.user

        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        request.data["from_user"] = request_user.id

        serializer = IssueSerializer(data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueDetailApiView(GenericAPIView):
    """The detail endpoint for the issue object.

    Endpoints:

        /issues/:issue_id/
            **GET:**
                required permission: ``drtrottoir.models.Student`` if the issue from_user field
                is the user of the request OR syndicus if they are the syndicus of the building
                for which the issue was made and approval_user is not NULL OR
                ``drtrottoir.models.Student(is_super_student=True)``

                Get the issue object with the given ID.
            **PATCH:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``

                Update the message of the issue.
            **DELETE:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)`` OR
                ``drtrottoir.models.Syndicus`` if they are the syndicus of the building for which the issue was
                made and approval_user is not NULL

                Set the issue to resolved=True.
    """  # noqa

    def get(self, request, issue_id, *args, **kwargs):
        try:
            instance = Issue.objects.get(id=issue_id)

            if (
                not IsSuperStudent().has_permission(request, None)
                and not IsFromUserOfIssue().has_object_permission(
                    request, None, instance
                )
                and not IsSyndicusOfBuildingAndApprovalNull().has_object_permission(
                    request, None, instance
                )
            ):
                return Response(status=status.HTTP_403_FORBIDDEN)

            serializer = IssueSerializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Issue.DoesNotExist:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
            )

    def patch(self, request, issue_id, *args, **kwargs):
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsSuperStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
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
        try:
            instance = Issue.objects.get(id=issue_id)

            if not IsSuperStudent().has_permission(
                request, None
            ) and not IsSyndicusOfBuildingAndApprovalNotNull().has_object_permission(
                request, None, instance
            ):
                return Response(status=status.HTTP_403_FORBIDDEN)

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


class IssueNotApprovedApiView(GenericAPIView):
    """The list endpoint for the issue object with approval_user equal to None.

    Endpoints:

        /issues/not_approved/
            **GET:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``

                All issues with approved=False.
    """  # noqa

    def get(self, request, *args, **kwargs):
        if not IsAuthenticated().has_permission(
            request, None
        ) or not IsSuperStudent().has_permission(request, None):
            return Response(status=status.HTTP_403_FORBIDDEN)
        issues = self.paginate_queryset(Issue.objects.filter(approval_user=None))
        serializer = IssueSerializer(issues, many=True)
        return self.get_paginated_response(serializer.data)
