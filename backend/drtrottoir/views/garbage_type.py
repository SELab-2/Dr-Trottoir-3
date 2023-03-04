from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from drtrottoir.serializers.garbage_type import GarbageTypeSerializer
from drtrottoir.models import GarbageType


class GarbageTypesApiView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """"""
        serializer = GarbageTypeSerializer(GarbageType.objects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *arg, **kwargs):
        """"""
        request_user = request.user

        if request_user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        garbage_type_id = request.data.get('garbage_type_id')

        data = {
            'garbage_type': garbage_type_id
        }

        serializer = GarbageTypeSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)