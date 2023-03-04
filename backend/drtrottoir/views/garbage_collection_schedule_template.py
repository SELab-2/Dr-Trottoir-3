from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from drtrottoir.models import (
    GarbageCollectionScheduleTemplate,
    GarbageCollectionScheduleTemplateEntry,
)
from drtrottoir.serializers import (
    GarbageCollectionScheduleTemplateEntrySerializer,
    GarbageCollectionScheduleTemplateSerializer,
)


class GarbageCollectionScheduleTemplateEntryViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageCollectionScheduleTemplateEntry.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateEntrySerializer


class GarbageCollectionScheduleTemplateViewSet(ModelViewSet):
    permission_classes = []

    queryset = GarbageCollectionScheduleTemplate.objects.all()
    serializer_class = GarbageCollectionScheduleTemplateSerializer


class GarbageCollectionScheduleTemplateEntryApiView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """ """
        serializer = GarbageCollectionScheduleTemplateEntrySerializer(
            GarbageCollectionScheduleTemplateEntry.objects, many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO - check user permissions

        serializer = GarbageCollectionScheduleTemplateEntrySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GarbageCollectionScheduleTemplateApiView(APIView):
    permission_classes = []

    def get(self, request, *args, **kwargs):
        """ """
        serializer = GarbageCollectionScheduleTemplateSerializer(
            GarbageCollectionScheduleTemplate.objects, many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ """
        if request.user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # TODO - check user permissions

        serializer = GarbageCollectionScheduleTemplateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
