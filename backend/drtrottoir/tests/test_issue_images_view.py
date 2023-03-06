import tempfile

import pytest
from PIL import Image
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import insert_dummy_issue, insert_dummy_issue_image, insert_dummy_user


@pytest.mark.django_db
def test_issue_images_api_view_post():
    """
    This test inserts an image in the /media/issue_images folder
    and does not remove this file.
    """
    dummy_user = insert_dummy_user()
    dummy_issue = insert_dummy_issue(dummy_user)
    image = Image.new("RGB", (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)

    client = APIClient()
    response = client.post(
        "/issue_images/",
        {"image": tmp_file, "issue": dummy_issue.id},
        format="multipart",
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_issue_images_api_view_get_all_one_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.get("/issue_images/")

    response_data_ids = [e["id"] for e in response.data]

    assert response.status_code == 200
    assert dummy_issue_image.id in response_data_ids
    assert len(response_data_ids) == 1


@pytest.mark.django_db
def test_issue_images_api_view_get_all_multiple_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image_1 = insert_dummy_issue_image(dummy_user)
    dummy_issue_image_2 = insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.get("/issue_images/")

    response_data_ids = [e["id"] for e in response.data]

    assert response.status_code == 200
    assert dummy_issue_image_1.id in response_data_ids
    assert dummy_issue_image_2.id in response_data_ids
    assert len(response_data_ids) == 2


@pytest.mark.django_db
def test_issue_images_detail_api_view_get_valid_one_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.get(f"/issue_images/{dummy_issue_image.id}/")

    assert response.status_code == 200
    assert response.data["id"] == dummy_issue_image.id


@pytest.mark.django_db
def test_issue_images_detail_api_view_get_valid_multiple_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)
    insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.get(f"/issue_images/{dummy_issue_image.id}/")

    assert response.status_code == 200
    assert response.data["id"] == dummy_issue_image.id


@pytest.mark.django_db
def test_issue_images_detail_api_view_get_invalid_none_present():
    client = APIClient()
    response = client.get("/issue_images/1/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_get_invalid_one_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.get(f"/issue_images/{dummy_issue_image.id+1}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_valid_one_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)

    client = APIClient()
    response = client.delete(f"/issue_images/{dummy_issue_image.id}/")

    assert response.status_code == 200

    response = client.get(f"/issue_images/{dummy_issue_image.id}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_valid_multiple_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image_1 = insert_dummy_issue_image(dummy_user)
    dummy_issue_image_2 = insert_dummy_issue_image(dummy_user)

    client = APIClient()

    response = client.delete(f"/issue_images/{dummy_issue_image_1.id}/")
    assert response.status_code == 200

    response = client.get(f"/issue_images/{dummy_issue_image_1.id}/")
    assert response.status_code == 404

    response = client.get(f"/issue_images/{dummy_issue_image_2.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_invalid_none_present():
    client = APIClient()
    response = client.delete("/issue_images/1/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_invalid_one_present():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_image = insert_dummy_issue_image(dummy_user)

    client = APIClient()

    response = client.delete(f"/issue_images/{dummy_issue_image.id+1}/")
    assert response.status_code == 404

    response = client.get(f"/issue_images/{dummy_issue_image.id+1}/")
    assert response.status_code == 404

    response = client.get(f"/issue_images/{dummy_issue_image.id}/")
    assert response.status_code == 200
