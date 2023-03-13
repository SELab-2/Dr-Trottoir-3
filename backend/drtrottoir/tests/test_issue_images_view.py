import tempfile

import pytest
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_issue,
    insert_dummy_issue_image,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)


@pytest.mark.django_db
def test_issue_images_api_view_post_jpg():
    """
    This test inserts an image in the /media/issue_images folder
    and does not remove this file.
    """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue = insert_dummy_issue(user.user)
    image = Image.new("RGB", (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)

    response = client.post(
        "/issue_images/",
        {"image": tmp_file, "issue": dummy_issue.id},
        format="multipart",
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_issue_images_api_view_post_png():
    """
    This test inserts an image in the /media/issue_images folder
    and does not remove this file.
    """
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue = insert_dummy_issue(user.user)
    image = Image.new("RGB", (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix=".png")
    image.save(tmp_file)
    tmp_file.seek(0)

    response = client.post(
        "/issue_images/",
        {"image": tmp_file, "issue": dummy_issue.id},
        format="multipart",
    )

    assert response.status_code == 201


@pytest.mark.django_db
def test_issue_images_api_view_no_file_extension():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue = insert_dummy_issue(user.user)
    image = Image.new("RGB", (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)
    tmp_file.name = "temp_file"

    response = client.post(
        "/issue_images/",
        {"image": tmp_file, "issue": dummy_issue.id},
        format="multipart",
    )

    assert response.status_code == 400


# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_api_view_get_all_one_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     dummy_user = insert_dummy_user()
#
#     dummy_issue_image = insert_dummy_issue_image(dummy_user)
#
#     response = client.get("/issue_images/")
#
#     response_data_ids = [e["id"] for e in response.data]
#
#     assert response.status_code == 200
#     assert dummy_issue_image.id in response_data_ids
#     assert len(response_data_ids) == 1

# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_api_view_get_all_multiple_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     dummy_user = insert_dummy_user()
#
#     dummy_issue_image_1 = insert_dummy_issue_image(dummy_user)
#     dummy_issue_image_2 = insert_dummy_issue_image(dummy_user)
#
#     response = client.get("/issue_images/")
#
#     response_data_ids = [e["id"] for e in response.data]
#
#     assert response.status_code == 200
#     assert dummy_issue_image_1.id in response_data_ids
#     assert dummy_issue_image_2.id in response_data_ids
#     assert len(response_data_ids) == 2

# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_detail_api_view_get_valid_one_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     dummy_user = insert_dummy_user()
#
#     dummy_issue_image = insert_dummy_issue_image(dummy_user)
#
#     response = client.get(f"/issue_images/{dummy_issue_image.id}/")
#
#     assert response.status_code == 200
#     assert response.data["id"] == dummy_issue_image.id

# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_detail_api_view_get_valid_multiple_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     dummy_user = insert_dummy_user()
#
#     dummy_issue_image = insert_dummy_issue_image(dummy_user)
#     insert_dummy_issue_image(dummy_user)
#
#     response = client.get(f"/issue_images/{dummy_issue_image.id}/")
#
#     assert response.status_code == 200
#     assert response.data["id"] == dummy_issue_image.id

# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_detail_api_view_get_invalid_none_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     response = client.get("/issue_images/1/")
#
#     assert response.status_code == 404

# Code removed on March 11 2023, since it does not follow the API guide.
# @pytest.mark.django_db
# def test_issue_images_detail_api_view_get_invalid_one_present():
#     user = insert_dummy_admin()
#     client = APIClient()
#     client.force_authenticate(user.user)
#
#     dummy_user = insert_dummy_user()
#
#     dummy_issue_image = insert_dummy_issue_image(dummy_user)
#
#     response = client.get(f"/issue_images/{dummy_issue_image.id + 1}/")
#
#     assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_valid_one_present():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_image = insert_dummy_issue_image(user.user)

    response = client.delete(f"/issue_images/{dummy_issue_image.id}/")

    assert response.status_code == 200

    # Code removed on March 11 2023, since it does not follow the API guide.
    # response = client.get(f"/issue_images/{dummy_issue_image.id}/")

    # assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_valid_multiple_present():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_image_1 = insert_dummy_issue_image(user.user)

    # Code removed on March 11 2023, since it does not follow the API guide.
    # dummy_issue_image_2 = insert_dummy_issue_image(dummy_user)

    response = client.delete(f"/issue_images/{dummy_issue_image_1.id}/")
    assert response.status_code == 200

    # Code removed on March 11 2023, since it does not follow the API guide.
    # response = client.get(f"/issue_images/{dummy_issue_image_1.id}/")
    # assert response.status_code == 404
    #
    # response = client.get(f"/issue_images/{dummy_issue_image_2.id}/")
    # assert response.status_code == 200


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_invalid_none_present():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    response = client.delete("/issue_images/1/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_issue_images_detail_api_view_delete_invalid_one_present():
    user = insert_dummy_admin()
    client = APIClient()
    client.force_authenticate(user.user)

    dummy_issue_image = insert_dummy_issue_image(user.user)

    response = client.delete(f"/issue_images/{dummy_issue_image.id + 1}/")
    assert response.status_code == 404

    # Code removed on March 11 2023, since it does not follow the API guide.
    # response = client.get(f"/issue_images/{dummy_issue_image.id + 1}/")
    # assert response.status_code == 404

    # response = client.get(f"/issue_images/{dummy_issue_image.id}/")
    # assert response.status_code == 200


def _test_issue_images_api_post(user=None, issue_user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue = insert_dummy_issue(issue_user)
    image = Image.new("RGB", (100, 100))

    tmp_file = tempfile.NamedTemporaryFile(suffix=".png")
    image.save(tmp_file)
    tmp_file.seek(0)

    return client.post(
        "/issue_images/",
        {"image": tmp_file, "issue": dummy_issue.id},
        format="multipart",
    )


@pytest.mark.django_db
def test_issue_images_api_post_no_user_fail():
    """ """
    response = _test_issue_images_api_post()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issue_images_api_post_student_success():
    """ """
    user = insert_dummy_student()

    response = _test_issue_images_api_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issue_images_api_post_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issue_images_api_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issue_images_api_post_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_issue_images_api_post(user.user)

    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_issue_images_api_post_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user("test@test.com")
    user = insert_dummy_syndicus(dummy_user)

    response = _test_issue_images_api_post(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


def _test_issue_images_api_delete(user=None, issue_user=None):
    """ """
    client = APIClient()
    if user is not None:
        client.force_authenticate(user)

    dummy_issue_image = insert_dummy_issue_image(issue_user)

    return client.delete(f"/issue_images/{dummy_issue_image.id}/")


@pytest.mark.django_db
def test_issue_images_api_delete_no_user_fail():
    """ """
    response = _test_issue_images_api_delete()

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issue_images_api_delete_student_fail():
    """ """
    user = insert_dummy_student()

    response = _test_issue_images_api_delete(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_issue_images_api_delete_super_student_success():
    """ """
    user = insert_dummy_student(is_super_student=True)

    response = _test_issue_images_api_delete(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issue_images_api_delete_admin_success():
    """ """
    user = insert_dummy_admin()

    response = _test_issue_images_api_delete(user.user)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_issue_images_api_delete_syndicus_fail():
    """ """
    dummy_user = insert_dummy_user("test@test.com")
    user = insert_dummy_syndicus(dummy_user)

    response = _test_issue_images_api_delete(user.user)

    assert response.status_code == status.HTTP_403_FORBIDDEN
