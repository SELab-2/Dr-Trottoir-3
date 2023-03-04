import json

import pytest
from rest_framework.test import force_authenticate, APIRequestFactory, APIClient

from drtrottoir.models import User
from drtrottoir.views import (
    LocationGroupListApiView,
    LocationGroupDetailApiView,
)
from .dummy_data import insert_dummy_location_group


@pytest.mark.django_db
def test_location_groups_get_list():
    dummy_location_group_id_1 = insert_dummy_location_group("location 1").id
    dummy_location_group_id_2 = insert_dummy_location_group("location 2").id
    non_existing_location_group_id = (
        dummy_location_group_id_1 + dummy_location_group_id_2
    )
    client = APIClient()
    response = client.get("/location_groups/")

    response_ids = [e["id"] for e in response.data]
    assert dummy_location_group_id_1 in response_ids
    assert dummy_location_group_id_2 in response_ids
    assert non_existing_location_group_id not in response_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_location_groups_post():
    client = APIClient()
    user = User.objects.create_user(username="test@gmail.com", password="test")

    data = {
        "name": "location1",
    }
    client.force_login(user)
    response = client.post(
        "/location_groups/", json.dumps(data), content_type="application/json"
    )

    assert response.data == {"id": 1, "name": "location1"}
    assert response.status_code == 201


@pytest.mark.django_db
def test_location_groups_get_detail():
    dummy_location_group = insert_dummy_location_group("location 1")
    client = APIClient()
    response = client.get(f"/location_groups/{dummy_location_group.id}/")

    assert (
        dummy_location_group.id == response.data["id"]
        and dummy_location_group.name == response.data["name"]
    )


@pytest.mark.django_db
def test_location_groups_patch_detail():
    dummy_location_group = insert_dummy_location_group("location 1")
    data = {"name": "city 1"}
    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.patch(
        f"/location_groups/{dummy_location_group.id}/",
        json.dumps(data),
        content_type="application/json",
    )
    assert response.data == {"id": 1, "name": "city 1"}
    assert response.status_code == 200


@pytest.mark.django_db
def test_location_groups_delete_detail():
    dummy_location_group = insert_dummy_location_group("location 1")
    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(f"/location_groups/{dummy_location_group.id}/")

    assert (
        dummy_location_group.id == response.data["id"]
        and dummy_location_group.name == response.data["name"]
        and response.status_code == 200
    )

    response = client.delete(f"/location_groups/{dummy_location_group.id}/")
    assert response.status_code == 204
    response = client.get(f"/location_groups/{dummy_location_group.id}/")
    assert response.status_code == 404


#  old tests
@pytest.mark.django_db
def test_location_groups_api_view_get():
    dummy_location_group_id_1 = insert_dummy_location_group("location 1").id
    dummy_location_group_id_2 = insert_dummy_location_group("location 2").id
    dummy_location_group_id_3 = insert_dummy_location_group("location 3").id
    non_existing_location_group_id = (
        dummy_location_group_id_1
        + dummy_location_group_id_2
        + dummy_location_group_id_3
    )

    User.objects.create_user(username="test@gmail.com", password="test")
    user = User.objects.get(username="test@gmail.com")

    factory = APIRequestFactory()
    view = LocationGroupListApiView.as_view()

    request = factory.get("/location_groups/")
    force_authenticate(request, user=user)
    response = view(request)

    response_data_ids = [e["id"] for e in response.data]

    assert dummy_location_group_id_1 in response_data_ids
    assert dummy_location_group_id_2 in response_data_ids
    assert dummy_location_group_id_3 in response_data_ids
    assert non_existing_location_group_id not in response_data_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_location_groups_api_view_post():
    dummy_location_group_data = {"name": "location 1"}

    User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    user = User.objects.get(username="test@gmail.com")
    view = LocationGroupListApiView.as_view()

    request = factory.post(
        "/location_groups/",
        json.dumps(dummy_location_group_data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request)

    assert response.data == {"id": 1, "name": "location 1"}
    assert response.status_code == 201

    dummy_location_group_data = {"nom": "location 1"}

    request = factory.post(
        "/location_groups/",
        json.dumps(dummy_location_group_data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request)

    assert response.status_code == 400


@pytest.mark.django_db
def test_location_groups_detail_api_view_get():
    dummy_location_group_id_1 = insert_dummy_location_group("location 1").id
    dummy_location_group_id_2 = insert_dummy_location_group("location 2").id
    non_existing_location_group_id = (
        dummy_location_group_id_1 + dummy_location_group_id_2
    )

    factory = APIRequestFactory()
    view = LocationGroupDetailApiView.as_view()

    User.objects.create_user(username="test@gmail.com", password="test")
    user = User.objects.get(username="test@gmail.com")

    request = factory.get("/location_groups/1/")
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_1)
    assert response.data == {"id": 1, "name": "location 1"}

    request = factory.get("/location_groups/2/")
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_2)
    assert response.data == {"id": 2, "name": "location 2"}

    request = factory.get("/location_groups/3/")
    response = view(request, non_existing_location_group_id)
    assert response.status_code == 404


@pytest.mark.django_db
def test_location_groups_detail_api_view_patch():
    dummy_location_group_id_1 = insert_dummy_location_group("location 1").id

    dummy_location_group_data = {"name": "city 1"}

    User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    user = User.objects.get(username="test@gmail.com")
    view = LocationGroupDetailApiView.as_view()

    request = factory.patch(
        "/location_groups/1",
        data=json.dumps(dummy_location_group_data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_1)

    assert response.data == {"id": 1, "name": "city 1"}
    assert response.status_code == 202

    dummy_location_group_data = {"nom": "city 1"}
    request = factory.patch(
        "/location_groups/1",
        data=json.dumps(dummy_location_group_data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_1)
    assert response.status_code == 400


@pytest.mark.django_db
def test_location_group_detail_api_delete():
    dummy_location_group_id_1 = insert_dummy_location_group("location 1").id

    User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    user = User.objects.get(username="test@gmail.com")
    view = LocationGroupDetailApiView.as_view()

    request = factory.delete("/location_groups/1")
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_1)
    assert response.status_code == 204

    request = factory.get("/location_groups/1")
    force_authenticate(request, user=user)
    response = view(request, dummy_location_group_id_1)
    assert response.status_code == 404
