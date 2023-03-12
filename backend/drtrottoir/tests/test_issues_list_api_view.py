import json

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_issue,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)


@pytest.mark.django_db
def test_issues_list_api_view_post():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_building = insert_dummy_building()

    dummy_issue_data = {"building": dummy_building.id, "message": "dummy message"}

    response = client.post(
        "/issues/", json.dumps(dummy_issue_data), content_type="application/json"
    )

    assert response.data == {
        "id": 1,
        "resolved": False,
        "message": "dummy message",
        "building": 1,
        "from_user": 1,
        "approval_user": None,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_issues_list_api_view_get():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_id_1 = insert_dummy_issue(user.user).id
    dummy_issue_id_2 = insert_dummy_issue(user.user).id
    non_existing_issue_id = dummy_issue_id_1 + dummy_issue_id_2

    response = client.get("/issues/")

    response_data_ids = [e["id"] for e in response.data]

    assert dummy_issue_id_1 in response_data_ids
    assert dummy_issue_id_2 in response_data_ids
    assert non_existing_issue_id not in response_data_ids
    assert response.status_code == 200


def _test_issues_list_api_view_get(user=None, issue_user=None, building=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    insert_dummy_issue(dummy_user=issue_user, dummy_building=building)

    return client.get("/issues/")


@pytest.mark.django_db
def test_issues_list_api_view_get_no_user_fail():
    """ """
    response = _test_issues_list_api_view_get()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_list_api_view_get_student_fail():
    """ """
    user = insert_dummy_student()

    response = _test_issues_list_api_view_get(user.user, user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_list_api_view_get_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issues_list_api_view_get(user.user, user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_list_api_view_get_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_issues_list_api_view_get(user.user, user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_list_api_view_get_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user()
    user = insert_dummy_syndicus(dummy_user)

    response = _test_issues_list_api_view_get(user.user, user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


def _test_issues_list_api_view_post(user=None, issue_user=None, building=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_building = insert_dummy_building()

    dummy_issue_data = {"building": dummy_building.id, "message": "dummy message"}

    return client.post(
        "/issues/", json.dumps(dummy_issue_data), content_type="application/json"
    )


@pytest.mark.django_db
def test_issues_list_api_view_post_no_user_fail():
    """ """
    response = _test_issues_list_api_view_post()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_list_api_view_post_student_success():
    """ """
    user = insert_dummy_student()

    response = _test_issues_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issues_list_api_view_post_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issues_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issues_list_api_view_post_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_issues_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issues_list_api_view_post_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user()
    user = insert_dummy_syndicus(dummy_user)

    response = _test_issues_list_api_view_post(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN
