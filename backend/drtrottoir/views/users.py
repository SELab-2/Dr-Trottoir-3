from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import User
from drtrottoir.permissions import IsSuperstudentOrAdmin
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
    """

    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = User.objects.all()
    serializer_class = UserSerializer

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
