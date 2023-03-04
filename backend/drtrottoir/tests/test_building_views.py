import pytest
from drtrottoir.models import User
from drtrottoir.views import BuildingListApiView
from rest_framework.test import APIRequestFactory, force_authenticate

from .dummy_data import insert_dummy_building


@pytest.mark.django_db
def test_building_api_view_get():
    building_id_1 = insert_dummy_building("building 1 adress", "path building 1").id
    building_id_2 = insert_dummy_building("building 2 adress", "path building 2").id
    non_exiting_building_id = building_id_1 + building_id_2

    User.objects.create_user(username="test@gmail.com", password="test")
    user = User.objects.get(username="test@gmail.com")

    factory = APIRequestFactory()
    view = BuildingListApiView.as_view()

    request = factory.get("/buildings/")
    force_authenticate(request, user=user)
    response = view(request)

    response_data_ids = [e["id"] for e in response.data]

    assert building_id_1 in response_data_ids
    assert building_id_2 in response_data_ids
    assert non_exiting_building_id not in response_data_ids
    assert response.status_code == 200
