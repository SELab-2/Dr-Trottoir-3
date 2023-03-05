import json

import pytest
from drtrottoir.models import User
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_location_group,
    insert_dummy_building,
    insert_dummy_schedule_definition,
)


@pytest.mark.django_db
def test_location_groups_forbidden_methods():
    client = APIClient()
    assert client.patch("/location_groups/").status_code == 405
    assert client.delete("/location_groups/").status_code == 405
    assert client.put("/location_groups/").status_code == 405


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


@pytest.mark.django_db
def test_location_group_get_buildings_list():
    location_group_1 = insert_dummy_location_group()
    location_group_2 = insert_dummy_location_group()
    building_1 = insert_dummy_building(lg=location_group_1)
    building_2 = insert_dummy_building(lg=location_group_1)
    building_3 = insert_dummy_building(lg=location_group_2)

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(f"/location_groups/{location_group_1.id}/buildings/")

    response_ids = [e["id"] for e in response.data]

    assert building_1.id in response_ids
    assert building_2.id in response_ids
    assert building_3.id not in response_ids


@pytest.mark.django_db
def test_location_group_get_schedule_definitions_list():
    location_group_1 = insert_dummy_location_group()
    location_group_2 = insert_dummy_location_group()
    sched_definition_1 = insert_dummy_schedule_definition(lg=location_group_1)
    sched_definition_2 = insert_dummy_schedule_definition(lg=location_group_1)
    sched_definition_3 = insert_dummy_schedule_definition(lg=location_group_2)

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(
        f"/location_groups/{location_group_1.id}/schedule_definitions/"
    )

    response_ids = [e["id"] for e in response.data]

    assert sched_definition_1.id in response_ids
    assert sched_definition_2.id in response_ids
    assert sched_definition_3.id not in response_ids
