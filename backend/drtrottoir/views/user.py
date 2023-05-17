import uuid
from typing import Dict, List

from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from drtrottoir.models import User
from drtrottoir.permissions import (
    IsSuperstudentOrAdmin,
    IsSyndicus,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import (
    UserInviteSerializer,
    UserResetPasswordSerializer,
    UserSerializer,
)
from drtrottoir.settings import DOMAIN, SENDGRID_API_KEY, SENDGRID_FROM_MAIL

from .mixins import PermissionsByActionMixin


class UserViewSet(ModelViewSet, PermissionsByActionMixin):
    """
    Viewset that handles all routes related to listing users.

    Endpoints:

        /users/
        **GET:**
            required permission: `drtrottoir.permissions.IsSuperstudentOrAdmin`

            List all users.

        /users/syndici/
        **GET:**
            required permission: `drtrottoir.permissions.IsSuperstudentOrAdmin`

            List all syndici.

        /users/admins/
        **GET:**
            required permission: `drtrottoir.permissions.IsSuperstudentOrAdmin`

            List all admins.

        /users/students/
        **GET:**
            required permission: `drtrottoir.permissions.IsSuperstudentOrAdmin`

            List all students.

        /users/me/
        **GET:**
            Required permission: `permissions.IsAuthenticated`
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    filterset_fields = {
        "student__is_super_student": ("exact",),
        "student__location_group": ("exact", "in"),
        "syndicus__buildings": ("exact",),
        "student__id": ("gt",),
        "syndicus__id": ("gt",),
        "admin__id": ("gt",),
    }
    search_fields = ["first_name", "last_name", "username"]

    permission_classes_by_action: Dict[str, List[str]] = {
        "invite_link": [],
        "post_invite_link": [],
    }
    permission_classes = [
        permissions.IsAuthenticated,
        IsSuperstudentOrAdmin | IsSyndicus,
    ]

    def get_queryset(self):
        if user_is_superstudent_or_admin(self.request.user):
            return User.objects.all()

        return User.objects.filter(
            syndicus__buildings__syndici=self.request.user.syndicus
        ).distinct()

    @action(detail=False)
    def students(self, request):
        users = User.objects.filter(student__isnull=False)
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

    @action(detail=False)
    def syndici(self, request):
        users = User.objects.filter(syndicus__isnull=False)
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

    @action(detail=False)
    def admins(self, request):
        users = User.objects.filter(admin__isnull=False)
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)

    @action(detail=False, permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

    @action(
        detail=False,
        # https://ihateregex.io/expr/uuid/
        url_path=r"invite/(?P<uuid>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})",  # noqa
        permission_classes=[],
    )
    def invite_link(self, request, uuid):
        try:
            user = User.objects.get(invite_link=uuid)

        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)

        return Response(serializer.data)

    @invite_link.mapping.post
    def post_invite_link(self, request, uuid):
        try:
            user = User.objects.get(invite_link=uuid)

        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserInviteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data["password"])
        user.invite_link = None
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["POST"])
    def revoke_invite(self, request, pk=None):
        user = self.get_object()
        user.invite_link = None
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["POST"])
    def reset_password(self, request):
        if SENDGRID_API_KEY == "disabled":
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = UserResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(username=serializer.validated_data["email"])

        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        link = uuid.uuid4()
        user.reset_password_link = link
        user.save()

        message = Mail(
            from_email=SENDGRID_FROM_MAIL,
            to_emails=user.username,
            subject="Dr. Trottoir Password Reset",
            html_content=f"{DOMAIN}/reset-password/{link}",
        )

        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
        except Exception as e:
            print("Sendgrid failed:", e)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        # https://ihateregex.io/expr/uuid/
        url_path=r"reset-password/(?P<uuid>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})",  # noqa
        permission_classes=[],
        methods=["POST"],
    )
    def post_reset_password_link(self, request, uuid):
        try:
            user = User.objects.get(reset_password_link=uuid)

        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserInviteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data["password"])
        user.reset_password_link = None
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
