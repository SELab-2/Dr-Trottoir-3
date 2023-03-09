import datetime
import json
import tempfile

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_issue,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_syndicus,
)


@pytest.mark.django_db
def test_buildings_get_list():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    non_existent_building_id = dummy_building_1.id + dummy_building_2.id
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

    # tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    # tmp_file.seek(0)

    data = {
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        # "pdf_guide": tmp_file,
    }
    client.force_login(user)
    response = client.post(
        "/buildings/", json.dumps(data), content_type="application/json"
    )

    assert response.data == {
        "id": 1,
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        "pdf_guide": None
    }
    assert response.status_code == 201
    # assert response.data["pdf_guide"].endswith(".pdf")


@pytest.mark.django_db
def test_building_get_detail():
    dummy_building = insert_dummy_building()
    client = APIClient()
    response = client.get(f"/buildings/{dummy_building.id}/")

    assert (
        dummy_building.id == response.data["id"]
        and dummy_building.address == response.data["address"]
        and dummy_building.pdf_guide == response.data["pdf_guide"]
        and dummy_building.is_active == response.data["is_active"]
        and dummy_building.location_group.id == response.data["location_group"]
    )


@pytest.mark.django_db
def test_building_patch_detail():
    dummy_building = insert_dummy_building()
    dummy_location_group = insert_dummy_location_group()

    # tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    # tmp_file.seek(0)

    data = {
        "address": "address 1",
        # "filename": tmp_file,
        "is_active": True,
        "location_group": dummy_location_group.id,
    }

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.patch(
        f"/buildings/{dummy_building.id}/",
        json.dumps(data),
        content_type="application/json"
    )

    print(response.data)
    assert response.data == {
        "id": 1,
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        "pdf_guide": None
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
        and dummy_building.is_active == response.data["is_active"]
        and dummy_building.location_group.id == response.data["location_group"]
    )

    response = client.delete(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 204
    response = client.get(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_get_buildings_from_syndicus():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    dummy_building_3 = insert_dummy_building()

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    dummy_syndicus_1 = insert_dummy_syndicus(
        user=user, buildings=[dummy_building_1, dummy_building_2]
    )

    response = client.get(f"/buildings/users/{dummy_syndicus_1.user_id}/")

    response_ids = [e["id"] for e in response.data]
    assert dummy_building_1.id in response_ids
    assert dummy_building_2.id in response_ids
    assert dummy_building_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedule_definitions_list():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    dummy_schedule_definition_1 = insert_dummy_schedule_definition(
        buildings=[dummy_building_1]
    )
    dummy_schedule_definition_2 = insert_dummy_schedule_definition(
        buildings=[dummy_building_1]
    )
    dummy_schedule_definition_3 = insert_dummy_schedule_definition(
        buildings=[dummy_building_2]
    )

    user = User.objects.create_user(username="test@gmail.com", password="test")
    client = APIClient()
    client.force_login(user)
    response = client.get(f"/buildings/{dummy_building_1.id}/schedule_definitions/")

    response_ids = [e["id"] for e in response.data]

    assert dummy_schedule_definition_1.id in response_ids
    assert dummy_schedule_definition_2.id in response_ids
    assert dummy_schedule_definition_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_issues_list():
    user = User.objects.create_user(username="test@gmail.com", password="test")
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    issue_1 = insert_dummy_issue(user, building_1)
    issue_2 = insert_dummy_issue(user, building_1)
    issue_3 = insert_dummy_issue(user, building_2)

    client = APIClient()
    response = client.get(f"/buildings/{building_1.id}/issues/")
    response_ids = [e["id"] for e in response.data]

    assert issue_1.id in response_ids
    assert issue_2.id in response_ids
    assert issue_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedule_templates_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    template_1 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_2 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_3 = insert_dummy_garbage_collection_schedule_template(building_2)

    client = APIClient()
    response = client.get(
        f"/buildings/{building_1.id}/garbage_collection_schedule_templates/"
    )
    response_ids = [e["id"] for e in response.data]

    assert template_1.id in response_ids
    assert template_2.id in response_ids
    assert template_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedules_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    schedule_1 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_2 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_3 = insert_dummy_garbage_collection_schedule(building_2)

    client = APIClient()
    response = client.get(f"/buildings/{building_1.id}/garbage_collection_schedules/")
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedules_by_date_list():
    building_1 = insert_dummy_building()
    schedule_1 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 1, 3)
    )
    schedule_2 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 1, 3)
    )
    schedule_3 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 2, 3)
    )

    client = APIClient()
    tmp = schedule_1.for_day
    print(tmp)
    response = client.get(
        f"/buildings/{building_1.id}/for_day/{schedule_1.for_day}"
        f"/garbage_collection_schedules/"
    )
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids
