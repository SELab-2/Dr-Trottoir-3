from django.http import QueryDict
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
    """
    Viewset handling issues.

    Endpoints:
        /issues/
            **GET:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``
                All issues.

            **POST:**
                required permission: ``drtrottoir.models.Student``
                Create a new issue type, return newly created object.

        /issues/:issue_id/
            **GET:**
                required permission: ``drtrottoir.models.Student`` if the issue
                    from_user field is the user of the request OR syndicus if they
                    are the syndicus of the building for which the issue was made
                    and approval_user is not NULL OR
                    ``drtrottoir.models.Student(is_super_student=True)``
                Get the issue object with the given ID.

            **PUT:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``
                Update all fields of the issue.

            **PATCH:**
                required permission: ``drtrottoir.models.Student(is_super_student=True)``
                Update some fields of the issue.

            **DELETE:**
                required permission:
                    ``drtrottoir.models.Student(is_super_student=True)`` OR
                    ``drtrottoir.models.Syndicus`` if they are the syndicus of the
                    building for which the issue was made and approval_user is not
                    NULL
                Set the issue to resolved=True.
    """  # noqa

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

    filterset_fields = {
        "building": ("exact", "in"),
        "resolved": ("exact",),
        "from_user": ("exact", "in"),
        "approval_user": ("exact", "in"),
    }
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
        if isinstance(request.data, QueryDict):
            # If request.data is a QueryDict, allow it to be mutable,
            # i.e. allow from_user to be added
            request.data._mutable = True
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
        serializer = self.get_serializer_class()(issues, many=True)
        return Response(serializer.data)
