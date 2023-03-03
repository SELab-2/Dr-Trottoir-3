import json

import pytest
from django.test import RequestFactory

from drtrottoir.models import User
from drtrottoir.schedule_assignment_views import (
    ScheduleAssignmentApiView,
    ScheduleAssignmentDateUserApiView,
    ScheduleAssignmentListApiView,
    ScheduleAssignmentsByScheduleDefinition,
)
from drtrottoir.serializers import (
    BuildingSerializer,
    LocationGroupSerializer,
    ScheduleAssignmentSerializer,
    ScheduleDefinitionSerializer,
)

# region Insert dummies

# Randomly chosen date, in format YYYY-MM-DD
DUMMY_SCHEDULE_ASSIGNMENT_DATE: str = "2022-01-26"


def insert_dummy_location_group():
    dummy_location_group_data = {"name": "dummy_location_group_name"}

    location_group_serializer = LocationGroupSerializer(data=dummy_location_group_data)
    assert location_group_serializer.is_valid()
    location_group_serializer.save()
    return location_group_serializer.data["id"]


def insert_dummy_building(dummy_location_group_instance_id: int):
    dummy_building_data = {
        "address": "dummy street",
        "guide_pdf_path": "dummy pdf path",
        "location_group": dummy_location_group_instance_id,
    }
    building_serializer = BuildingSerializer(data=dummy_building_data)
    assert building_serializer.is_valid()
    building_serializer.save()

    return building_serializer.data["id"]


def insert_dummy_schedule_definition(
        dummy_building_instances_ids: list[int], dummy_location_group_instance_id: int
):
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

    return schedule_definition_serializer.data["id"]


def insert_dummy_user(name="test"):
    email = f"{name}@gmail.com"
    dummy_user: User = User.objects.create_user(
        username=email, password="test", email=email
    )
    return dummy_user.id


def insert_dummy_schedule_assignment(user_id: int, schedule_definition_id: int):
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

    return schedule_assignment_serializer.data["id"]


# endregion Insert dummies

# region Schedule assignment tests


@pytest.mark.django_db
def test_schedule_assignment_list_api_view_get():
    dummy_user = insert_dummy_user()
    dummy_location_group = insert_dummy_location_group()
    dummy_building_1 = insert_dummy_building(dummy_location_group)
    dummy_building_2 = insert_dummy_building(dummy_location_group)

    dummy_schedule_definition = insert_dummy_schedule_definition(
        [dummy_building_1, dummy_building_2], dummy_location_group
    )

    """"""
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
def test_schedule_assignment_list_api_view_post():
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
    request = factory.get(f"/schedule_assignments/{result_id}/")
    response = view(request, schedule_assignment_id=result_id)
    assert response.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_api_view_get():
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
def test_schedule_assignment_api_view_delete():
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
def test_schedule_assignment_api_view_patch():
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
def test_schedule_assignment_by_date_api_view_get():
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
def test_schedule_assignment_by_schedule_definition_api_view_get():
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

# endregion Schedule assignment tests
