import pytest
from rest_framework import status
from rest_framework.test import APIClient

from .dummy_data import insert_dummy_admin, insert_dummy_issue, insert_dummy_student


@pytest.mark.django_db
def test_issues_all_not_approved():
    """ """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_id_1 = insert_dummy_issue(user.user).id
    dummy_issue_id_2 = insert_dummy_issue(user.user).id

    response = client.get("/issues/?approved=0")

    response_data_ids = [e["id"] for e in response.data["results"]]

    assert dummy_issue_id_1 in response_data_ids
    assert dummy_issue_id_2 in response_data_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_issues_all_approved():
    """ """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)
    dummy_issue_1 = insert_dummy_issue(user.user)
    dummy_issue_2 = insert_dummy_issue(user.user)

    dummy_issue_1.approval_user = user.user
    dummy_issue_1.save()

    dummy_issue_2.approval_user = user.user
    dummy_issue_2.save()

    response = client.get("/issues/not_approved/")

    response_data_ids = [e["id"] for e in response.data["results"]]

    assert len(response_data_ids) == 0
    assert response.status_code == 200


@pytest.mark.django_db
def test_issues_some_approved():
    """ """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_1 = insert_dummy_issue(user.user)
    dummy_issue_2 = insert_dummy_issue(user.user)

    dummy_issue_1.approval_user = user.user
    dummy_issue_1.save()

    response = client.get("/issues/not_approved/")

    response_data_ids = [e["id"] for e in response.data["results"]]

    assert len(response_data_ids) == 1
    assert dummy_issue_1.id not in response_data_ids
    assert dummy_issue_2.id in response_data_ids
    assert response.status_code == 200


def _test_issues_not_approved_api_view_get(user=None, issue_user=None, building=None):
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    insert_dummy_issue(dummy_user=issue_user, dummy_building=building)

    return client.get("/issues/not_approved/")


@pytest.mark.django_db
def test_issues_not_approved_get_no_user_fail():
    """ """
    response = _test_issues_not_approved_api_view_get()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_not_approved_get_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issues_not_approved_api_view_get(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_not_approved_get_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_issues_not_approved_api_view_get(user.user)

    assert response.status_code == status.HTTP_200_OK
