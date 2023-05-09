from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import User
from drtrottoir.permissions import (
    IsSuperstudentOrAdmin,
    IsSyndicus,
    user_is_superstudent_or_admin,
)
from drtrottoir.serializers import UserSerializer


class UserViewSet(ModelViewSet):
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
