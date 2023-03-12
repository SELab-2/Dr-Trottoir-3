import json

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_type,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_post():
    building = insert_dummy_building()
    garbage_type = insert_dummy_garbage_type()
    data = {
        "for_day": "2002-03-17",
        "garbage_type": garbage_type.id,
        "building": building.id,
    }

    user = insert_dummy_student(is_super_student=True)

    client = APIClient()
    client.force_login(user.user)
    response = client.post(
        "/garbage_collection_schedules/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.data == {
        "id": 1,
        "for_day": "2002-03-17",
        "garbage_type": garbage_type.id,
        "building": building.id,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_get_detail():
    entry = insert_dummy_garbage_collection_schedule()

    user = insert_dummy_student()

    client = APIClient()
    client.force_login(user.user)
    response = client.get(f"/garbage_collection_schedules/{entry.id}/")

    assert (
        response.data["id"] == entry.id
        and response.data["garbage_type"] == entry.garbage_type.id
        and response.data["building"] == entry.building.id
        and response.data["for_day"] == str(entry.for_day)
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_patch():
    entry = insert_dummy_garbage_collection_schedule()
    old_day = entry.for_day
    new_day = "2002-01-09" if old_day != "2002-01-09" else "2002-03-17"

    user = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(user.user)

    data = {"for_day": new_day}

    client.patch(f"/garbage_collection_schedules/{entry.id}/", data)

    response = client.get(f"/garbage_collection_schedules/{entry.id}/")
    assert response.data["for_day"] == new_day


@pytest.mark.django_db
def test_garbage_collection_schedule_delete():
    entry = insert_dummy_garbage_collection_schedule()

    user = insert_dummy_student(is_super_student=True)

    client = APIClient()
    client.force_login(user.user)

    response = client.delete(f"/garbage_collection_schedules/{entry.id}/")
    assert response.status_code == 204

    response = client.get(f"/garbage_collection_schedules/{entry.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_forbidden_methods():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_login(user.user)
    assert client.get("/garbage_collection_schedules/").status_code == 405
    assert client.patch("/garbage_collection_schedules/").status_code == 405
    assert client.delete("/garbage_collection_schedules/").status_code == 405
    assert client.put("/garbage_collection_schedules/").status_code == 405


def _test_garbage_collection_schedules_list_api_view_post(user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_building = insert_dummy_building()
    dummy_date = "2002-03-17"
    dummy_garbage_type = insert_dummy_garbage_type()

    dummy_data = {
        "building": dummy_building.id,
        "for_day": dummy_date,
        "garbage_type": dummy_garbage_type.id,
    }

    return client.post(
        "/garbage_collection_schedules/",
        json.dumps(dummy_data),
        content_type="application/json",
    )


@pytest.mark.django_db
def test_garbage_collection_schedules_list_api_view_post_no_user_fail():
    """ """
    response = _test_garbage_collection_schedules_list_api_view_post()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_list_api_view_post_student_fail():
    """ """
    user = insert_dummy_student()

    response = _test_garbage_collection_schedules_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_list_api_view_post_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_garbage_collection_schedules_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_garbage_collection_schedules_list_api_view_post_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_garbage_collection_schedules_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_garbage_collection_schedules_list_api_view_post_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user()
    user = insert_dummy_syndicus(dummy_user)

    response = _test_garbage_collection_schedules_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


def _test_garbage_collection_schedules_detail_api_view_get(user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy = insert_dummy_garbage_collection_schedule()

    return client.get(f"/garbage_collection_schedules/{dummy.id}/")


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_get_no_user_fail():
    """ """
    response = _test_garbage_collection_schedules_detail_api_view_get()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_get_student_success():
    """ """
    user = insert_dummy_student()

    response = _test_garbage_collection_schedules_detail_api_view_get(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_get_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user()
    user = insert_dummy_syndicus(user=dummy_user)
    response = _test_garbage_collection_schedules_detail_api_view_get(user=user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_get_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)
    response = _test_garbage_collection_schedules_detail_api_view_get(user=user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_get_admin_success():
    """ """
    user = insert_dummy_admin()
    response = _test_garbage_collection_schedules_detail_api_view_get(user=user.user)

    assert response.status_code == status.HTTP_200_OK


def _test_garbage_collection_schedules_detail_api_view_patch(user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy = insert_dummy_garbage_collection_schedule()

    dummy_data = {"for_day": "2002-01-09"}

    return client.patch(
        f"/garbage_collection_schedules/{dummy.id}/",
        json.dumps(dummy_data),
        content_type="application/json",
    )


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_patch_no_user_fail():
    """ """
    response = _test_garbage_collection_schedules_detail_api_view_patch()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_patch_student_fail():
    """ """
    user = insert_dummy_student()

    response = _test_garbage_collection_schedules_detail_api_view_patch(user=user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_patch_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_garbage_collection_schedules_detail_api_view_patch(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_patch_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_garbage_collection_schedules_detail_api_view_patch(user.user)

    assert response.status_code == status.HTTP_200_OK


def _test_garbage_collection_schedules_detail_api_view_delete(user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy = insert_dummy_garbage_collection_schedule()

    return client.delete(f"/garbage_collection_schedules/{dummy.id}/")


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_delete_no_user_fail():
    """ """
    response = _test_garbage_collection_schedules_detail_api_view_delete()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_delete_student_fail():
    """ """
    user = insert_dummy_student()

    response = _test_garbage_collection_schedules_detail_api_view_delete(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_delete_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_garbage_collection_schedules_detail_api_view_delete(user.user)

    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_delete_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_garbage_collection_schedules_detail_api_view_delete(user.user)

    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_garbage_collection_schedules_detail_api_view_delete_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user()
    user = insert_dummy_syndicus(user=dummy_user)

    response = _test_garbage_collection_schedules_detail_api_view_delete(user=user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN
