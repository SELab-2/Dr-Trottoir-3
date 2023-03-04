import pytest

from drtrottoir.models import User
from rest_framework.test import APIClient


from .dummy_data import insert_dummy_issue


@pytest.mark.django_db
def test_issues_all_not_approved():
    """

    """
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_id_1 = insert_dummy_issue(dummy_user).id
    dummy_issue_id_2 = insert_dummy_issue(dummy_user).id

    client = APIClient()
    response = client.get(f'/issues/not_approved/')

    response_data_ids = [e['id'] for e in response.data]

    assert dummy_issue_id_1 in response_data_ids
    assert dummy_issue_id_2 in response_data_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_issues_all_approved():
    """

    """
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_1 = insert_dummy_issue(dummy_user)
    dummy_issue_2 = insert_dummy_issue(dummy_user)

    dummy_issue_1.approval_user = dummy_user
    dummy_issue_1.save()

    dummy_issue_2.approval_user = dummy_user
    dummy_issue_2.save()

    client = APIClient()
    response = client.get(f'/issues/not_approved/')

    response_data_ids = [e['id'] for e in response.data]

    assert len(response_data_ids) == 0
    assert response.status_code == 200


@pytest.mark.django_db
def test_issues_some_approved():
    """

    """
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_1 = insert_dummy_issue(dummy_user)
    dummy_issue_2 = insert_dummy_issue(dummy_user)

    dummy_issue_1.approval_user = dummy_user
    dummy_issue_1.save()

    client = APIClient()
    response = client.get(f'/issues/not_approved/')

    response_data_ids = [e['id'] for e in response.data]

    assert len(response_data_ids) == 1
    assert dummy_issue_1.id not in response_data_ids
    assert dummy_issue_2.id in response_data_ids
    assert response.status_code == 200
