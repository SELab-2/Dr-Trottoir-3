import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.serializers import ScheduleWorkEntrySerializer

# TODO These are written in test_schedule_assignment.py Refactor them later
from drtrottoir.tests.test_schedule_assignment import (
    date_equals,
    insert_dummy_building,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_user,
)

# region Insert dummies

DUMMY_SCHEDULE_WORK_ENTRY_DATETIME: str = "2022-01-26 06:00"


def insert_dummy_schedule_work_entry(
    creator_id: int, building_id: int, schedule_definition_id: int
) -> int:
    dummy_schedule_work_entry_data = {
        "creation_timestamp": DUMMY_SCHEDULE_WORK_ENTRY_DATETIME,
        "image_path": "pics/image.png",
        "creator": creator_id,
        "building": building_id,
        "schedule_definition": schedule_definition_id,
    }
    schedule_work_entry_serializer = ScheduleWorkEntrySerializer(
        data=dummy_schedule_work_entry_data
    )
    assert schedule_work_entry_serializer.is_valid()
    schedule_work_entry_serializer.save()

    schedule_work_entry_id: int = schedule_work_entry_serializer.data["id"]
    return schedule_work_entry_id


# endregion Insert dummies

# region Schedule work entry tests


@pytest.mark.django_db
def test_schedule_work_entry_list_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_work_entry = insert_dummy_schedule_work_entry(
        creator_id=dummy_user,
        building_id=dummy_building_1,
        schedule_definition_id=dummy_schedule_definition,
    )
    dummy_schedule_work_entry_nonexistent = dummy_schedule_work_entry + 3

    client = APIClient()
    response = client.get("/schedule_work_entries/")
    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert dummy_schedule_work_entry in response_ids
    assert dummy_schedule_work_entry_nonexistent not in response_ids


@pytest.mark.django_db
def test_schedule_work_entry_post() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_image_path = "pics/image.png"
    data = {
        "creation_timestamp": DUMMY_SCHEDULE_WORK_ENTRY_DATETIME,
        "image_path": dummy_image_path,
        "creator": dummy_user,
        "building": dummy_building_1,
        "schedule_definition": dummy_schedule_definition,
    }

    client = APIClient()
    response = client.post(
        "/schedule_work_entries/",
        data=json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 201
    assert response.data["id"] > 0
    assert response.data["image_path"] == dummy_image_path
    assert response.data["creator"] == dummy_user
    assert response.data["building"] == dummy_building_1
    assert response.data["schedule_definition"] == dummy_schedule_definition
    assert date_equals(
        DUMMY_SCHEDULE_WORK_ENTRY_DATETIME, response.data["creation_timestamp"]
    )


@pytest.mark.django_db
def test_schedule_work_entry_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_work_entry = insert_dummy_schedule_work_entry(
        creator_id=dummy_user,
        building_id=dummy_building_1,
        schedule_definition_id=dummy_schedule_definition,
    )
    dummy_schedule_work_entry_nonexistent = dummy_schedule_work_entry + 3

    client = APIClient()
    response = client.get(f"/schedule_work_entries/{dummy_schedule_work_entry}/")

    assert response.status_code == 200
    assert response.data["id"] == dummy_user

    # Check for nonexistent user
    response_nonexistent = client.get(
        f"/schedule_work_entries/{dummy_schedule_work_entry_nonexistent}/"
    )
    assert response_nonexistent.status_code == 404


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_id() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_work_entry = insert_dummy_schedule_work_entry(
        creator_id=dummy_user,
        building_id=dummy_building_1,
        schedule_definition_id=dummy_schedule_definition,
    )

    client = APIClient()
    response = client.get(f"/schedule_work_entries/users/{dummy_user}/")
    response_work_entries = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert dummy_schedule_work_entry in response_work_entries
