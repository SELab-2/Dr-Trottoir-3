import json

import pytest
from drtrottoir.models import User
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_location_group,
    insert_dummy_building,
    insert_dummy_schedule_definition,
    insert_dummy_schedule_definition_building,
)


@pytest.mark.django_db
def test_buildings_get_list():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    non_existent_building_id = (
        dummy_building_1.id + dummy_building_2.id
    )
    client = APIClient()
    response = client.get("/buildings/")

    response_ids = [e["id"] for e in response.data]
    assert dummy_building_1.id in response_ids
    assert dummy_building_2.id in response_ids
    assert non_existent_building_id not in response_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_buildings_post():
    client = APIClient()
    user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_location_group = insert_dummy_location_group()

    data = {
        "address": "address 1",
        "guide_pdf_path": "path 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
    }
    client.force_login(user)
    response = client.post(
        "/buildings/", json.dumps(data), content_type="application/json"
    )

    assert response.data == {
        "id": 1,
        "address": "address 1",
        "guide_pdf_path": "path 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_building_get_detail():
    dummy_building = insert_dummy_building()
    client = APIClient()
    response = client.get(f"/buildings/{dummy_building.id}/")

    assert (
            dummy_building.id == response.data["id"]
            and dummy_building.address == response.data["address"]
            and dummy_building.guide_pdf_path == response.data["guide_pdf_path"]
            and dummy_building.is_active == response.data["is_active"]
            and dummy_building.location_group.id == response.data["location_group"]
    )


@pytest.mark.django_db
def test_building_patch_detail():
    dummy_building = insert_dummy_building()
    dummy_location_group = insert_dummy_location_group()

    data = {
        "address": "address 1",
        "guide_pdf_path": "path 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
    }

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.patch(f"/buildings/{dummy_building.id}/", json.dumps(data), content_type="application/json")

    assert response.data == {
        "id": 1,
        "address": "address 1",
        "guide_pdf_path": "path 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
    }
    assert response.status_code == 200


@pytest.mark.django_db
def test_building_delete_detail():
    dummy_building = insert_dummy_building()
    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(f"/buildings/{dummy_building.id}/")

    assert (
            dummy_building.id == response.data["id"]
            and dummy_building.address == response.data["address"]
            and dummy_building.guide_pdf_path == response.data["guide_pdf_path"]
            and dummy_building.is_active == response.data["is_active"]
            and dummy_building.location_group.id == response.data["location_group"]
    )

    response = client.delete(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 204
    response = client.get(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_building_get_schedule_definitions_list():
    dummy_schedule_definition_1 = insert_dummy_schedule_definition()
    dummy_schedule_definition_2 = insert_dummy_schedule_definition()
    dummy_schedule_definition_3 = insert_dummy_schedule_definition()
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    insert_dummy_schedule_definition_building(dummy_building_1, dummy_schedule_definition_1)
    insert_dummy_schedule_definition_building(dummy_building_1, dummy_schedule_definition_2)
    insert_dummy_schedule_definition_building(dummy_building_2, dummy_schedule_definition_3)

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(f"/buildings/{dummy_building_1.id}/schedule_definitions/")

    response_ids = [e["id"] for e in response.data]

    assert dummy_schedule_definition_1.id in response_ids
    assert dummy_schedule_definition_2.id in response_ids
    assert dummy_schedule_definition_3.id not in response_ids
