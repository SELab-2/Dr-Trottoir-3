from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from drtrottoir.models import Issue
from drtrottoir.permissions import (
    IsStudent,
    IsSuperstudentOrAdmin,
    IsSyndicus,
    IsSyndicusOfBuildingAndApprovalNotNull,
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
