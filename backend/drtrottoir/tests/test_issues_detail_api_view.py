import pytest
import json

from drtrottoir.models import User
from rest_framework.test import force_authenticate, APIRequestFactory, APIClient

from drtrottoir.views.issues_views import IssueDetailApiView

from .dummy_data import insert_dummy_building, insert_dummy_issue


@pytest.mark.django_db
def test_issues_detail_api_view_get_valid_one_present():
    """

    """
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_1 = insert_dummy_issue(dummy_user)

    client = APIClient()
    response = client.get(f'/issues/{dummy_issue_1.id}/')

    assert response.status_code == 200
    assert response.data == {
        'id': dummy_issue_1.id,
        'resolved': dummy_issue_1.resolved,
        'message': dummy_issue_1.message,
        'building': dummy_issue_1.building.id,
        'from_user': dummy_issue_1.from_user.id,
        'approval_user': None if dummy_issue_1.approval_user is None else dummy_issue_1.approval_user.id
    }



@pytest.mark.django_db
def test_issues_detail_api_view_get_invalid_id():
    """

    """
    client = APIClient()
    response = client.get(f'/issues/1/')
    assert response.status_code == 400

@pytest.mark.django_db
def test_issues_detail_api_view_patch_valid():
    """

    """


@pytest.mark.django_db
def test_issues_detail_api_view_patch_invalid_id():
    """

    """

@pytest.mark.django_db
def test_issues_detail_api_view_patch_invalid_data():
    """

    """


@pytest.mark.django_db
def test_issues_detail_api_view_delete_valid():
    """

    """


@pytest.mark.django_db
def test_issues_detail_api_view_delete_invalid_id():
    """

    """
