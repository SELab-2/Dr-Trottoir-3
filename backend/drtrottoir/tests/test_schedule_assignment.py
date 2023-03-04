import json

import pytest
from dateutil import parser
from rest_framework.test import APIClient

from drtrottoir.models import User
from drtrottoir.serializers import (
    BuildingSerializer,
    LocationGroupSerializer,
    ScheduleAssignmentSerializer,
    ScheduleDefinitionSerializer,
)

# region Insert dummies

# Randomly chosen date, in format YYYY-MM-DD
DUMMY_SCHEDULE_ASSIGNMENT_DATE: str = "2022-01-26"


def insert_dummy_location_group() -> int:
    dummy_location_group_data = {"name": "dummy_location_group_name"}

    location_group_serializer = LocationGroupSerializer(data=dummy_location_group_data)
    assert location_group_serializer.is_valid()
    location_group_serializer.save()
    location_group_id: int = location_group_serializer.data["id"]
    return location_group_id


def insert_dummy_building(dummy_location_group_instance_id: int) -> int:
    dummy_building_data = {
        "address": "dummy street",
        "guide_pdf_path": "dummy pdf path",
        "location_group": dummy_location_group_instance_id,
    }
    building_serializer = BuildingSerializer(data=dummy_building_data)
    assert building_serializer.is_valid()
    building_serializer.save()

    building_id: int = building_serializer.data["id"]
    return building_id


def insert_dummy_schedule_definition(
        dummy_building_instances_ids: list[int], dummy_location_group_instance_id: int
) -> int:
    dummy_schedule_definition_data = {
        "name": "dummy schedule definition name",
        "version": 1,
        "location_group": dummy_location_group_instance_id,
        "buildings": dummy_building_instances_ids,
    }
    schedule_definition_serializer = ScheduleDefinitionSerializer(
        data=dummy_schedule_definition_data
    )
    assert schedule_definition_serializer.is_valid()
    schedule_definition_serializer.save()

    schedule_definition_id: int = schedule_definition_serializer.data["id"]
    return schedule_definition_id


def insert_dummy_user(name: str = "test") -> int:
    email = f"{name}@gmail.com"
    dummy_user: User = User.objects.create_user(
        username=email, password="test", email=email
    )
    return dummy_user.id


def insert_dummy_schedule_assignment(user_id: int, schedule_definition_id: int) -> int:
    dummy_schedule_assignment_data = {
        "assigned_date": DUMMY_SCHEDULE_ASSIGNMENT_DATE,  # Format must be YYYY-MM-DD
        "schedule_definition": schedule_definition_id,
        "user": user_id,
    }
    schedule_assignment_serializer = ScheduleAssignmentSerializer(
        data=dummy_schedule_assignment_data
    )
    assert schedule_assignment_serializer.is_valid()
    schedule_assignment_serializer.save()

    schedule_assignment_id: int = schedule_assignment_serializer.data["id"]
    return schedule_assignment_id


# endregion Insert dummies


def time_difference_in_seconds(date_str1: str, date_str2: str) -> float:
    date1 = parser.parse(date_str1).replace(tzinfo=None)
    date2 = parser.parse(date_str2).replace(tzinfo=None)
    difference_in_secs = abs((date1 - date2).total_seconds())
    return difference_in_secs


def date_equals(date_str1: str, date_str2: str) -> bool:
    return time_difference_in_seconds(date_str1, date_str2) < 1


"""
TODO
- Schedule assignments date user GET
"""


@pytest.mark.django_db
def test_schedule_assignment_get_by_id() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )

    client = APIClient()
    response = client.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    assert response.status_code == 200
    assert response.data["id"] == dummy_schedule_assignment
    assert response.data["user"] == dummy_user
    assert (
            time_difference_in_seconds(
                response.data["assigned_date"], DUMMY_SCHEDULE_ASSIGNMENT_DATE
            )
            < 1
    )


@pytest.mark.django_db
def test_schedule_assignment_post() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    data = {
        "assigned_date": DUMMY_SCHEDULE_ASSIGNMENT_DATE,
        "schedule_definition": dummy_schedule_definition,
        "user": dummy_user,
    }

    client = APIClient()

    response = client.post(
        f"/schedule_assignments/",
        data=json.dumps(data),
        content_type="application/json",
    )
    assert response.status_code == 201
    assert response.data["user"] == dummy_user
    assert response.data["schedule_definition"] == dummy_schedule_definition
    assert date_equals(DUMMY_SCHEDULE_ASSIGNMENT_DATE, response.data["assigned_date"])

    # Actually verify if the resource exists
    response_id = response.data["id"]
    assert client.get(f"/schedule_assignments/{response_id}/").status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_delete() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )

    client = APIClient()

    # Verify that user exists
    response_exists = client.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    assert response_exists.status_code == 200

    # Delete
    response_delete = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment}/")
    assert response_delete.status_code == 204

    # Verify that the user is actually deleted
    response_verify = client.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    assert response_verify.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_patch_user() -> None:
    dummy_user_1 = insert_dummy_user("test1")
    dummy_user_2 = insert_dummy_user("test2")
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user_1, dummy_schedule_definition
    )

    data = {
        "user": dummy_user_2
    }

    client = APIClient()
    response = client.patch(f"/schedule_assignments/{dummy_schedule_assignment}/", data)

    assert response.status_code == 200
    assert response.data["user"] == dummy_user_2
    assert response.data["schedule_definition"] == dummy_schedule_definition


@pytest.mark.django_db
def test_schedule_assignment_patch_other() -> None:
    """
    Tests whether changing something other than the user affects the data.
    It shouldn't, as only the user can be changed.
    """
    dummy_user = insert_dummy_user("test1")
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition_1 = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )
    dummy_schedule_definition_2 = insert_dummy_schedule_definition(
        [dummy_building_1], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition_1
    )

    data = {
        "schedule_definition": dummy_schedule_definition_2,
        "assigned_date": "2000-01-01"
    }

    client = APIClient()
    response = client.patch(f"/schedule_assignments/{dummy_schedule_assignment}/", data)

    assert response.status_code == 200
    assert response.data["user"] == dummy_user
    assert response.data["schedule_definition"] == dummy_schedule_definition_1
    assert date_equals(DUMMY_SCHEDULE_ASSIGNMENT_DATE, response.data["assigned_date"])


@pytest.mark.django_db
def test_schedule_assignment_by_date_and_user() -> None:
    """
    Tests whether changing something other than the user affects the data.
    It shouldn't, as only the user can be changed.
    """
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )

    client = APIClient()
    response = client.get(f"/schedule_assignments/date/{DUMMY_SCHEDULE_ASSIGNMENT_DATE}/user/{dummy_user}/")
    response_ids = [data["id"] for data in response.data]
    assert response.status_code == 200
    assert dummy_schedule_assignment in response_ids


"""
# region Schedule assignment tests


@pytest.mark.django_db
def test_schedule_assignment_list_api_view_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment_1 = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )
    dummy_schedule_assignment_2 = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )
    dummy_schedule_assignment_nonexistent = (
        dummy_schedule_assignment_1 + dummy_schedule_assignment_2 + 3
    )

    factory = RequestFactory()
    view = ScheduleAssignmentListApiView.as_view()

    request = factory.get(f"/schedule_assignments/")
    response = view(request)

    response_data_ids = [e["id"] for e in response.data]

    assert dummy_schedule_assignment_1 in response_data_ids
    assert dummy_schedule_assignment_2 in response_data_ids
    assert dummy_schedule_assignment_nonexistent not in response_data_ids
    assert response.status_code == 200
    assert len(response_data_ids) == 2


@pytest.mark.django_db
def test_schedule_assignment_list_api_view_post() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    post_data = {
        "assigned_date": DUMMY_SCHEDULE_ASSIGNMENT_DATE,
        "schedule_definition": dummy_schedule_definition,
        "user": dummy_user,
    }

    factory = RequestFactory()
    view = ScheduleAssignmentListApiView.as_view()

    request = factory.post(
        "/schedule_assignments/",
        data=json.dumps(post_data),
        content_type="application/json",
    )
    response = view(request)

    assert response.data["id"] > 0
    assert response.data["user"] == dummy_user
    assert response.data["assigned_date"] == DUMMY_SCHEDULE_ASSIGNMENT_DATE
    assert response.data["schedule_definition"] == dummy_schedule_definition
    assert response.status_code == 201
    result_id = response.data["id"]

    # Verify that resource actually exists
    view_single = ScheduleAssignmentApiView.as_view()
    request = factory.get(f"/schedule_assignments/{result_id}/")
    response = view_single(request, schedule_assignment_id=result_id)
    assert response.status_code == 200
    assert response.data["id"] == result_id
    assert response.data["schedule_definition"] == dummy_schedule_definition


@pytest.mark.django_db
def test_schedule_assignment_api_view_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )
    dummy_schedule_assignment_nonexistent = dummy_schedule_assignment + 3

    factory = RequestFactory()
    view = ScheduleAssignmentApiView.as_view()

    request = factory.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    response = view(request, schedule_assignment_id=dummy_schedule_assignment)
    assert response.status_code == 200

    request_nonexistent = factory.get(
        f"/schedule_assignments/{dummy_schedule_assignment_nonexistent}/"
    )
    response_nonexistent = view(
        request_nonexistent,
        schedule_assignment_id=dummy_schedule_assignment_nonexistent,
    )
    assert response_nonexistent.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_api_view_delete() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )
    dummy_schedule_assignment_nonexistent = dummy_schedule_assignment + 3

    factory = RequestFactory()
    view = ScheduleAssignmentApiView.as_view()

    # Verify that resource exists
    request = factory.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    response = view(request, schedule_assignment_id=dummy_schedule_assignment)
    assert response.status_code == 200

    # Delete resource
    request = factory.delete(f"/schedule_assignments/{dummy_schedule_assignment}/")
    response = view(request, schedule_assignment_id=dummy_schedule_assignment)
    assert response.status_code == 204

    # Verify that resource no longer exists
    request = factory.get(f"/schedule_assignments/{dummy_schedule_assignment}/")
    response = view(request, schedule_assignment_id=dummy_schedule_assignment)
    assert response.status_code == 404

    # Make sure nonexistent resource can't be deleted
    request = factory.get(
        f"/schedule_assignments/{dummy_schedule_assignment_nonexistent}/"
    )
    response = view(
        request, schedule_assignment_id=dummy_schedule_assignment_nonexistent
    )
    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_api_view_patch() -> None:
    dummy_user_1 = insert_dummy_user(name="test1")
    dummy_user_2 = insert_dummy_user(name="test2")
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user_1, dummy_schedule_definition
    )

    # Replace the original user (dummy_user_1) with dummy_user_2
    patch_data = {"user": dummy_user_2}

    factory = RequestFactory()
    view = ScheduleAssignmentApiView.as_view()

    request = factory.patch(
        f"/schedule_assignments/{dummy_schedule_assignment}/",
        data=json.dumps(patch_data),
        content_type="application/json",
    )
    response = view(request, schedule_assignment_id=dummy_schedule_assignment)

    assert response.status_code == 202
    assert response.data["user"] == dummy_user_2


@pytest.mark.django_db
def test_schedule_assignment_by_date_api_view_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )
    dummy_schedule_assignment_date = DUMMY_SCHEDULE_ASSIGNMENT_DATE
    dummy_schedule_assignment_date_invalid = "2022-13-23"

    factory = RequestFactory()
    view = ScheduleAssignmentDateUserApiView.as_view()

    request = factory.get(
        f"/schedule_assignments/date/{dummy_schedule_assignment_date}/user/{dummy_user}/"
    )
    response = view(
        request,
        schedule_assignment_date=dummy_schedule_assignment_date,
        schedule_assignment_user=dummy_user,
    )
    assert response.status_code == 200
    response_ids = [response_data["id"] for response_data in response.data]
    assert dummy_schedule_assignment in response_ids

    # Test invalid date
    request = factory.get(
        f"/schedule_assignments/date/{dummy_schedule_assignment_date_invalid}/user/{dummy_user}/"
    )
    response = view(
        request,
        schedule_assignment_date=dummy_schedule_assignment_date_invalid,
        schedule_assignment_user=dummy_user,
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_assignment_by_schedule_definition_api_view_get() -> None:
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    dummy_schedule_assignment = insert_dummy_schedule_assignment(
        dummy_user, dummy_schedule_definition
    )

    factory = RequestFactory()
    view = ScheduleAssignmentsByScheduleDefinition.as_view()

    request = factory.get(
        f"/schedule_assignments/schedule_definitions/{dummy_schedule_definition}/"
    )
    response = view(request, schedule_definition_id=dummy_schedule_definition)
    assert response.status_code == 200

    response_ids = [response_data["id"] for response_data in response.data]
    assert dummy_schedule_assignment in response_ids


#fafa endregion Schedule assignment tests

"""
