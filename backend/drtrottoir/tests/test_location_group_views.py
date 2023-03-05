import json

import pytest
from drtrottoir.models import User
from rest_framework.test import APIClient

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
