import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import insert_dummy_building, insert_dummy_issue


@pytest.mark.django_db
def test_issues_list_api_view_post():
    dummy_building = insert_dummy_building()

    dummy_issue_data = {"building": dummy_building.id, "message": "dummy message"}

    User.objects.create_user(username="test@gmail.com", password="test")

    user = User.objects.get(username="test@gmail.com")

    client = APIClient()
    client.force_login(user)
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
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_id_1 = insert_dummy_issue(dummy_user).id
    dummy_issue_id_2 = insert_dummy_issue(dummy_user).id
    non_existing_issue_id = dummy_issue_id_1 + dummy_issue_id_2

    client = APIClient()
    response = client.get("/issues/")

    response_data_ids = [e["id"] for e in response.data]

    assert dummy_issue_id_1 in response_data_ids
    assert dummy_issue_id_2 in response_data_ids
    assert non_existing_issue_id not in response_data_ids
    assert response.status_code == 200


def _test_issues_list_api_view_get(client: APIClient):
    """

    """

@pytest.mark.django_db
def test_issues_list_api_view_get_no_user_fail():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_get_student_fail():
    """

    """

@pytest.mark.django_db
def test_issues_list_api_view_get_super_student_success():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_get_admin_success():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_get_syndicus_fail():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_post_no_user_fail():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_post_student_success():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_post_super_student_success():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_post_admin_success():
    """

    """


@pytest.mark.django_db
def test_issues_list_api_view_post_syndicus_fail():
    """

    """

