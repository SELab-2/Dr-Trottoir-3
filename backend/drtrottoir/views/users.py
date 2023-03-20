from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import User
from drtrottoir.permissions import IsSuperstudentOrAdmin
from drtrottoir.serializers import UserSerializer


class UserViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsSuperstudentOrAdmin]

    queryset = User.objects.all()
    serializer_class = UserSerializer
