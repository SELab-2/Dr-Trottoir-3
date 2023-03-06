import json
import tempfile

import pytest
from PIL import Image
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import insert_dummy_issue, insert_dummy_user


@pytest.mark.django_db
def test_file_is_accepted():
    """
    This test inserts an image in the /media/issue_images folder and does not remove this file.
    """
    dummy_user = insert_dummy_user()
    dummy_issue = insert_dummy_issue(dummy_user)
    image = Image.new('RGB', (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
    image.save(tmp_file)
    tmp_file.seek(0)

    client = APIClient()
    response = client.post('/issue_images/', {'image': tmp_file, 'issue': dummy_issue.id}, format='multipart')

    assert response.status_code == 201


# @pytest.mark.django_db
# def test_issues_detail_api_view_get_valid_one_present():
#     """ """
#     dummy_user = User.objects.create_user(username="test@gmail.com", password="test")
#
#     dummy_issue_1 = insert_dummy_issue(dummy_user)
#
#     client = APIClient()
#     response = client.get(f"/issues/{dummy_issue_1.id}/")
#
#     assert response.status_code == 200
#     assert response.data == {
#         "id": dummy_issue_1.id,
#         "resolved": dummy_issue_1.resolved,
#         "message": dummy_issue_1.message,
#         "building": dummy_issue_1.building.id,
#         "from_user": dummy_issue_1.from_user.id,
#         "approval_user": None
#         if dummy_issue_1.approval_user is None
#         else dummy_issue_1.approval_user.id,
#     }
#
#
# @pytest.mark.django_db
# def test_issues_detail_api_view_get_invalid_id():
#     """ """
#     client = APIClient()
#     response = client.get("/issues/1/")
#     assert response.status_code == 404
#
#
# @pytest.mark.django_db
# def test_issues_detail_api_view_patch_valid():
#     """ """
#     dummy_user = User.objects.create_user(username="test@gmail.com", password="test")
#     dummy_issue_1 = insert_dummy_issue(dummy_user)
#
#     dummy_issue_data = {"resolved": True, "message": "New message"}
#
#     client = APIClient()
#     response = client.patch(
#         f"/issues/{dummy_issue_1.id}/",
#         json.dumps(dummy_issue_data),
#         content_type="application/json",
#     )
#
#     assert response.status_code == 200
#     assert response.data == {
#         "id": dummy_issue_1.id,
#         "resolved": dummy_issue_data["resolved"],
#         "message": dummy_issue_data["message"],
#         "building": dummy_issue_1.building.id,
#         "from_user": dummy_issue_1.from_user.id,
#         "approval_user": None
#         if dummy_issue_1.approval_user is None
#         else dummy_issue_1.approval_user.id,
#     }
#
#
# @pytest.mark.django_db
# def test_issues_detail_api_view_patch_invalid_id():
#     """ """
#     dummy_issue_data = {"resolved": True, "message": "New message"}
#
#     client = APIClient()
#     response = client.patch(
#         "/issues/1/", json.dumps(dummy_issue_data), content_type="application/json"
#     )
#
#     assert response.status_code == 404
#
#
# @pytest.mark.django_db
# def test_issues_detail_api_view_delete_valid():
#     """ """
#     dummy_user = User.objects.create_user(username="test@gmail.com", password="test")
#     dummy_issue_1 = insert_dummy_issue(dummy_user)
#
#     client = APIClient()
#     response = client.delete(f"/issues/{dummy_issue_1.id}/")
#
#     assert response.status_code == 200
#     assert response.data == {
#         "id": dummy_issue_1.id,
#         "resolved": True,
#         "message": dummy_issue_1.message,
#         "building": dummy_issue_1.building.id,
#         "from_user": dummy_issue_1.from_user.id,
#         "approval_user": None
#         if dummy_issue_1.approval_user is None
#         else dummy_issue_1.approval_user.id,
#     }
#
#
# @pytest.mark.django_db
# def test_issues_detail_api_view_delete_invalid_id():
#     """ """
#     client = APIClient()
#     response = client.delete("/issues/1/")
#
#     assert response.status_code == 404
