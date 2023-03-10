import json

import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_type,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_admin,
    insert_dummy_user
)


@pytest.mark.django_db
def test_garbage_collection_schedule_post_with_correct_rights_returns_201():
    _test_garbage_collection_schedule_post(insert_dummy_student(is_super_student=True).user)


def _test_garbage_collection_schedule_post(user, expected=201, expected_id=1):
    building = insert_dummy_building()
    garbage_type = insert_dummy_garbage_type()
    data = {
        "for_day": "2002-03-17",
        "garbage_type": garbage_type.id,
        "building": building.id,
    }

    client = APIClient()
    if user is not None:
        client.force_login(user)
    response = client.post(
        "/garbage_collection_schedules/",
        json.dumps(data),
        content_type="application/json",
    )
    if expected < 300:
        assert response.data == {
            "id": expected_id,
            "for_day": "2002-03-17",
            "garbage_type": garbage_type.id,
            "building": building.id,
        }
    assert response.status_code == expected


@pytest.mark.django_db
def test_garbage_collection_schedule_get_detail_with_correct_rights_returns_200():
    _test_garbage_collection_schedule_get_detail(insert_dummy_student(is_super_student=False).user)


def _test_garbage_collection_schedule_get_detail(user, expected=200):
    entry = insert_dummy_garbage_collection_schedule()

    client = APIClient()
    if user is not None:
        client.force_login(user)
    response = client.get(f"/garbage_collection_schedules/{entry.id}/")
    if expected < 300:
        assert (
                response.data["id"] == entry.id
                and response.data["garbage_type"] == entry.garbage_type.id
                and response.data["building"] == entry.building.id
        )
    assert response.status_code == expected


@pytest.mark.django_db
def test_garbage_collection_schedule_patch_with_correct_rights_returns_200():
    _test_garbage_collection_schedule_patch(insert_dummy_student(is_super_student=True).user)


def _test_garbage_collection_schedule_patch(user, expected=200):
    entry = insert_dummy_garbage_collection_schedule()
    old_day = entry.for_day
    new_day = "2002-01-09" if old_day != "2002-01-09" else "2002-03-17"

    client = APIClient()
    if user is not None:
        client.force_login(user)

    data = {"for_day": new_day}

    patch_response = client.patch(f"/garbage_collection_schedules/{entry.id}/", data)

    if expected < 300:
        response = client.get(f"/garbage_collection_schedules/{entry.id}/")
        assert response.data["for_day"] == new_day
    assert patch_response.status_code == expected


@pytest.mark.django_db
def test_garbage_collection_schedule_delete_with_correct_rights_returns_204():
    _test_garbage_collection_schedule_delete(insert_dummy_student(is_super_student=True).user)


def _test_garbage_collection_schedule_delete(user, expected=204):
    entry = insert_dummy_garbage_collection_schedule()
    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.delete(f"/garbage_collection_schedules/{entry.id}/")
    assert response.status_code == expected
    if expected < 300:
        response = client.get(f"/garbage_collection_schedules/{entry.id}/")
        assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_forbidden_methods():
    client = APIClient()
    student = insert_dummy_student(is_super_student=True)

    client.force_login(student.user)
    assert client.get("/garbage_collection_schedules/").status_code == 405
    assert client.patch("/garbage_collection_schedules/").status_code == 405
    assert client.delete("/garbage_collection_schedules/").status_code == 405
    assert client.put("/garbage_collection_schedules/").status_code == 405


@pytest.mark.django_db
def test_garbage_collection_schedule_all_permissions_on_all_allowed_methods():
    currentid = 0

    def _test_post_with_two_arguments(user, expected):
        nonlocal currentid
        if expected < 300:
            currentid += 1
        _test_garbage_collection_schedule_post(user, expected, currentid)

    tests = (
        (_test_post_with_two_arguments, (403, 403, 201, 201, 403,),),
        (_test_garbage_collection_schedule_get_detail, (403, 200, 200, 200, 403)),
        (_test_garbage_collection_schedule_patch, (403, 403, 200, 200, 403)),
        (_test_garbage_collection_schedule_delete, (403, 403, 204, 204, 403)),
    )

    student = insert_dummy_student().user
    superstudent = insert_dummy_student(email="a@a.a", is_super_student=True).user
    admin = insert_dummy_admin(email="a@a.b", ).user
    syndicus = insert_dummy_user(email="z@a.a")
    insert_dummy_syndicus(syndicus)
    users = (None, student, superstudent, admin, syndicus)
    for test in tests:
        for index in range(0, len(users)):
            test[0](user=users[index], expected=test[1][index])
