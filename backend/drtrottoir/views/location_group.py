from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView

from drtrottoir.serializers import LocationGroupSerializer
from drtrottoir.models import LocationGroup


class LocationGroupListApiView(APIView):
    permission_classes = []

    def get(self, request: Request, *args, **kwargs) -> Response:
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        location_groups = LocationGroup.objects
        serializer = LocationGroupSerializer(location_groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, *args, **kwargs) -> Response:
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO check user permissions

        data = {"name": request.data.get("name")}

        serializer = LocationGroupSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocationGroupDetailApiView(APIView):
    permission_classes = []

    def get(self, request: Request, location_group_id: int) -> Response:
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        try:
            location_group = LocationGroup.objects.get(id=location_group_id)
        except LocationGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LocationGroupSerializer(location_group)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request: Request, location_group_id: int) -> Response:
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO check user permissions

        try:
            location_group = LocationGroup.objects.get(id=location_group_id)
        except LocationGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = {"name": request.data.get("name")}
        serializer = LocationGroupSerializer(location_group, partial=True, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, location_group_id: int) -> Response:
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO check user permissions

        try:
            location_group = LocationGroup.objects.get(id=location_group_id)
        except LocationGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        location_group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
