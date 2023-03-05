from drtrottoir.models import Building
from drtrottoir.serializers import BuildingSerializer
from rest_framework.viewsets import ModelViewSet


class BuildingListViewSet(ModelViewSet):
    permission_classes = []

    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
