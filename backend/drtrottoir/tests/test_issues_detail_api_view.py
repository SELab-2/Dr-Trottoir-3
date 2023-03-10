import json

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from drtrottoir.models import User, Syndicus, Building

from .dummy_data import insert_dummy_issue, insert_dummy_student, insert_dummy_syndicus, insert_dummy_admin, \
    insert_dummy_user, insert_dummy_building
from ..serializers import BuildingSerializer


@pytest.mark.django_db
def test_issues_detail_api_view_get_valid_one_present():
    """ """
    user = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_authenticate(user.user)
    dummy_issue_1 = insert_dummy_issue(user.user)

    response = client.get(f"/issues/{dummy_issue_1.id}/")

    assert response.status_code == 200
    assert response.data == {
        "id": dummy_issue_1.id,
        "resolved": dummy_issue_1.resolved,
        "message": dummy_issue_1.message,
        "building": dummy_issue_1.building.id,
        "from_user": dummy_issue_1.from_user.id,
        "approval_user": None
        if dummy_issue_1.approval_user is None
        else dummy_issue_1.approval_user.id,
    }


@pytest.mark.django_db
def test_issues_detail_api_view_get_invalid_id():
    """ """
    user = insert_dummy_admin()

    client = APIClient()
    client.force_authenticate(user.user)
    response = client.get("/issues/1/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_issues_detail_api_view_patch_valid():
    """ """
    user = insert_dummy_admin()
    dummy_issue_1 = insert_dummy_issue(user.user)

    dummy_issue_data = {"resolved": True, "message": "New message"}

    client = APIClient()
    client.force_authenticate(user.user)
    response = client.patch(
        f"/issues/{dummy_issue_1.id}/",
        json.dumps(dummy_issue_data),
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.data == {
        "id": dummy_issue_1.id,
        "resolved": dummy_issue_data["resolved"],
        "message": dummy_issue_data["message"],
        "building": dummy_issue_1.building.id,
        "from_user": dummy_issue_1.from_user.id,
        "approval_user": None
        if dummy_issue_1.approval_user is None
        else dummy_issue_1.approval_user.id,
    }


@pytest.mark.django_db
def test_issues_detail_api_view_patch_invalid_id():
    """ """
    user = insert_dummy_admin()
    dummy_issue_data = {"resolved": True, "message": "New message"}

    client = APIClient()
    client.force_authenticate(user.user)
    response = client.patch(
        "/issues/1/", json.dumps(dummy_issue_data), content_type="application/json"
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_issues_detail_api_view_delete_valid():
    """ """
    user = insert_dummy_admin()
    dummy_issue_1 = insert_dummy_issue(user.user)

    client = APIClient()
    client.force_authenticate(user.user)
    response = client.delete(f"/issues/{dummy_issue_1.id}/")

    assert response.status_code == 200
    assert response.data == {
        "id": dummy_issue_1.id,
        "resolved": True,
        "message": dummy_issue_1.message,
        "building": dummy_issue_1.building.id,
        "from_user": dummy_issue_1.from_user.id,
        "approval_user": None
        if dummy_issue_1.approval_user is None
        else dummy_issue_1.approval_user.id,
    }


@pytest.mark.django_db
def test_issues_detail_api_view_delete_invalid_id():
    """ """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)
    response = client.delete("/issues/1/")

    assert response.status_code == 404


def _test_issues_detail_api_view_get_invalid_id(user: User = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_user = insert_dummy_admin()
    dummy_issue = insert_dummy_issue(dummy_user)

    return client.get(f"/issues/{dummy_issue.id + 1}/")


def _test_issues_detail_api_view_get_valid_id(user: User = None, issue_user: User = None, building: Building = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    # dummy_user = insert_dummy_admin()
    dummy_issue = insert_dummy_issue(dummy_user=issue_user, dummy_building=building)

    return client.get(f"/issues/{dummy_issue.id}/")


@pytest.mark.django_db
def test_issues_detail_api_view_get_no_user_fail():
    """

    """
    response = _test_issues_detail_api_view_get_valid_id()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_get_student_success():
    """

    """
    user = insert_dummy_student()

    response = _test_issues_detail_api_view_get_valid_id(user.user, user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_get_student_fail():
    """

    """
    user = insert_dummy_student()

    response = _test_issues_detail_api_view_get_valid_id(user=user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_get_syndicus_success():
    """

    """
    building = insert_dummy_building()
    dummy_user = insert_dummy_user("email1@gmail.com")
    user = insert_dummy_syndicus(user=dummy_user, buildings=[building])

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user, building=building)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_get_syndicus_fail():
    """

    """
    dummy_user = insert_dummy_user("email1@gmail.com")
    user = insert_dummy_syndicus(user=dummy_user)

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_get_super_student_success():
    """

    """
    user = insert_dummy_student(is_super_student=True, email="email1@gmail.com")

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_get_admin_success():
    """

    """
    user = insert_dummy_admin("email1@gmail.com")

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user)

    assert response.status_code == status.HTTP_200_OK


def _test_issues_detail_api_view_patch_valid_id(user: User = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue_1 = insert_dummy_issue(user)

    dummy_issue_data = {"resolved": True, "message": "New message"}

    return client.patch(
        f"/issues/{dummy_issue_1.id}/",
        json.dumps(dummy_issue_data),
        content_type="application/json",
    )


def _test_issues_detail_api_view_patch_invalid_id(user: User = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue_1 = insert_dummy_issue(user)

    dummy_issue_data = {"resolved": True, "message": "New message"}

    return client.patch(
        f"/issues/{dummy_issue_1.id + 1}/",
        json.dumps(dummy_issue_data),
        content_type="application/json",
    )


@pytest.mark.django_db
def test_issues_detail_api_view_patch_no_user_fail():
    """

    """
    response = _test_issues_detail_api_view_patch_valid_id()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_patch_student_fail():
    """

    """
    user = insert_dummy_student()

    response = _test_issues_detail_api_view_patch_valid_id(user=user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_patch_super_student_success():
    """

    """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issues_detail_api_view_patch_valid_id(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_patch_admin_success():
    """

    """
    user = insert_dummy_admin()

    response = _test_issues_detail_api_view_patch_valid_id(user.user)

    assert response.status_code == status.HTTP_200_OK


def _test_issues_detail_api_view_delete_invalid_id(user: User = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue_1 = insert_dummy_issue(user)

    return client.delete(f"/issues/{dummy_issue_1.id + 1}/")


def _test_issues_detail_api_view_delete_valid_id(user: User = None):
    """

    """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue_1 = insert_dummy_issue(user)

    return client.delete(f"/issues/{dummy_issue_1.id}/")


@pytest.mark.django_db
def test_issues_detail_api_view_delete_no_user_fail():
    """

    """
    response = _test_issues_detail_api_view_patch_valid_id()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_delete_student_fail():
    """

    """
    user = insert_dummy_student()

    response = _test_issues_detail_api_view_delete_valid_id(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issues_detail_api_view_delete_super_student_success():
    """

    """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issues_detail_api_view_delete_valid_id(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_delete_admin_success():
    """

    """
    user = insert_dummy_admin()

    response = _test_issues_detail_api_view_delete_valid_id(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_delete_syndicus_success():
    """

    """
    building = insert_dummy_building()
    dummy_user = insert_dummy_user("email1@gmail.com")
    user = insert_dummy_syndicus(user=dummy_user, buildings=[building])

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user, building=building)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issues_detail_api_view_delete_syndicus_fail():
    """

    """
    dummy_user = insert_dummy_user("email1@gmail.com")
    user = insert_dummy_syndicus(user=dummy_user)

    issue_user = insert_dummy_user("email2@gmail.com")

    response = _test_issues_detail_api_view_get_valid_id(user=user.user, issue_user=issue_user)

    assert response.status_code == status.HTTP_403_FORBIDDEN
