import json

import dateutil.parser
import pytest
from django.test import RequestFactory

from drtrottoir.schedule_work_entry_views import (
    ScheduleWorkEntryApiView,
    ScheduleWorkEntryByCreatorApiView,
    ScheduleWorkEntryByScheduleDefinitionApiView,
    ScheduleWorkEntryListApiView,
)
from drtrottoir.serializers import ScheduleWorkEntrySerializer

# TODO These are written in test_schedule_assignment_api_view.py Refactor them later
from drtrottoir.tests.test_schedule_assignment_api_view import (
    insert_dummy_building,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_user,
)

"""
TODO:
- Schedule work entries user GET
"""

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
def test_schedule_work_entry_list_api_view_get() -> None:
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

    factory = RequestFactory()
    view = ScheduleWorkEntryListApiView.as_view()

    request = factory.get(f"/schedule_work_entries/")
    response = view(request)
    response_ids = [response_data["id"] for response_data in response.data]

    assert response.status_code == 200
    assert dummy_schedule_work_entry in response_ids
    assert dummy_schedule_work_entry_nonexistent not in response_ids


@pytest.mark.django_db
def test_schedule_work_entry_list_api_view_post() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_image_path = "pics/test.png"

    post_data = {
        "creation_timestamp": DUMMY_SCHEDULE_WORK_ENTRY_DATETIME,
        "image_path": dummy_image_path,
        "creator": dummy_user,
        "building": dummy_building_1,
        "schedule_definition": dummy_schedule_definition,
    }

    factory = RequestFactory()
    view = ScheduleWorkEntryListApiView.as_view()

    request = factory.post(
        "/schedule_work_entries/",
        data=json.dumps(post_data),
        content_type="application/json",
    )
    response = view(request)

    assert response.data["id"] > 0
    assert response.data["image_path"] == dummy_image_path
    assert response.data["creator"] == dummy_user
    assert response.data["building"] == dummy_building_1
    assert response.data["schedule_definition"] == dummy_schedule_definition
    assert response.status_code == 201

    # Datetime formats can differ, so we check for the difference between them as
    # converted objects
    creation_time_post = dateutil.parser.parse(DUMMY_SCHEDULE_WORK_ENTRY_DATETIME)
    creation_time_result = dateutil.parser.parse(response.data["creation_timestamp"])
    creation_time_result = creation_time_result.replace(
        tzinfo=None
    )  # Remove time zone information
    time_difference_in_seconds = abs(
        (creation_time_post - creation_time_result).total_seconds()
    )
    assert time_difference_in_seconds < 1  # We'll suffice with a one-second difference


@pytest.mark.django_db
def test_schedule_work_entry_api_view_get() -> None:
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

    factory = RequestFactory()
    view = ScheduleWorkEntryApiView.as_view()

    request = factory.get(f"/schedule_work_entries/{dummy_schedule_work_entry}/")
    response = view(request, schedule_work_entry_id=dummy_schedule_work_entry)

    assert response.data["id"] == dummy_schedule_work_entry
    assert response.data["creator"] == dummy_user
    assert response.status_code == 200

    # Test nonexistent entry
    request = factory.get(
        f"/schedule_work_entries/{dummy_schedule_work_entry_nonexistent}/"
    )
    response = view(
        request, schedule_work_entry_id=dummy_schedule_work_entry_nonexistent
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_work_entry_by_definition_api_view_get() -> None:
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

    factory = RequestFactory()
    view = ScheduleWorkEntryByScheduleDefinitionApiView.as_view()

    request = factory.get(
        f"/schedule_work_entries/schedule_definitions/{dummy_schedule_definition}/"
    )
    response = view(request, schedule_definition_id=dummy_schedule_definition)

    response_ids = [response_data["id"] for response_data in response.data]

    assert dummy_schedule_work_entry in response_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_schedule_work_entry_by_creator_api_view_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_user_nonexistent = dummy_user + 3
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

    factory = RequestFactory()
    view = ScheduleWorkEntryByCreatorApiView.as_view()

    # Check for user that exists and has the entry
    request = factory.get(f"/schedule_work_entries/users/{dummy_user}/")
    response = view(request, creator_id=dummy_user)
    response_ids = [response_data["id"] for response_data in response.data]

    assert dummy_schedule_work_entry in response_ids
    assert response.status_code == 200

    # Check for user does not exist
    request = factory.get(f"/schedule_work_entries/users/{dummy_user_nonexistent}/")
    response = view(request, creator_id=dummy_user_nonexistent)

    assert len(response.data) == 0
    assert response.status_code == 200


# endregion Schedule work entry tests
