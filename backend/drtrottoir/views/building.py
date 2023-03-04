from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from drtrottoir.serializers import BuildingSerializer
from drtrottoir.models import Building


class BuildingListViewSet(ModelViewSet):
    permission_classes = []

    queryset = Building.objects.all()
    serializer_class = BuildingSerializer


class BuildingListApiView(APIView):
    permission_classes = []

    def get(self, request: Request, *args, **kwargs) -> Response:
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        buildings = Building.objects
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, *args, **kwargs) -> Response:
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO check user permissions

        data = {
            "address": request.data.get("address"),
            "guide_pdf_path": request.data.get("guide_pdf_path"),
            "is_active": request.data.get("is_active"),
            "location_group": request.data.get("location_group"),
        }

        serializer = BuildingSerializer(data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
