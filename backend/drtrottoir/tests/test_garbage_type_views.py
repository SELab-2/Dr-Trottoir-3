import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import (
    insert_dummy_garbage_type,
    insert_dummy_student,
    insert_dummy_syndicus,
)


@pytest.mark.django_db
def test_garbage_type_api_view_get_success_return_200():
    dummy_entry_1 = insert_dummy_garbage_type()
    dummy_entry_2 = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.get("/garbage_type/")
    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([dummy_entry_1.id, dummy_entry_2.id])
    assert response.status_code == 200


@pytest.mark.django_db
def test_garbage_type_get_detail_existing_return_200():
    dummy_entry = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.get(f"/garbage_type/{dummy_entry.id}/")

    assert (
        response.data["id"] == dummy_entry.id
        and response.data["name"] == dummy_entry.name
        and response.status_code == 200
    )


@pytest.mark.django_db
def test_garbage_type_get_detail_non_existing_return_404():
    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.get(f"/garbage_type/0/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_type_post_success_return_201():
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert (
        response.data == {"id": 1, "name": "dummy garbage type"}
        and response.status_code == 201
    )


@pytest.mark.django_db
def test_garbage_type_delete_existing_return_204():
    dummy_entry = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.delete(f"/garbage_type/{dummy_entry.id}/")

    assert response.status_code == 204


@pytest.mark.django_db
def test_garbage_type_delete_non_existing_return_404():
    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.delete(f"/garbage_type/0/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_get_auth_success_return_200():
    client = APIClient()
    student = insert_dummy_student(email="student@gmail.com", is_super_student=False)
    super_student = insert_dummy_student(
        email="superstudent@gmail.com", is_super_student=True
    )
    user = User.objects.create_user(username="syndicus@gmail.com", password="test")
    insert_dummy_syndicus(user=user)

    client.force_login(student.user)
    response_student_permissions = client.get("/garbage_type/")
    client.force_login(super_student.user)
    response_super_student_permissions = client.get("/garbage_type/")
    client.login(username="syndicus@gmail.com", password="test")
    response_syndicus_permissions = client.get("/garbage_type/")

    assert (
        response_student_permissions.status_code == 200
        and response_super_student_permissions.status_code == 200
        and response_syndicus_permissions.status_code == 200
    )


@pytest.mark.django_db
def test_get_auth_failed_return_403():
    client = APIClient()

    response_no_auth = client.get("/garbage_type/")

    assert response_no_auth.status_code == 403


@pytest.mark.django_db
def test_delete_auth_success_return_204():
    dummy_entry = insert_dummy_garbage_type()

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.delete(f"/garbage_type/{dummy_entry.id}/")

    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_auth_failed_return_403():
    dummy_entry = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(email="student@gmail.com", is_super_student=False)
    user = User.objects.create_user(username="syndicus@gmail.com", password="test")
    syndicus = insert_dummy_syndicus(user=user)

    response_no_auth = client.delete(f"/garbage_type/{dummy_entry.id}/")
    client.force_login(student.user)
    response_student_permissions = client.delete(f"/garbage_type/{dummy_entry.id}/")
    client.force_login(syndicus.user)
    response_syndicus_permissions = client.delete(f"/garbage_type/{dummy_entry.id}/")

    assert (
        response_no_auth.status_code == 403
        and response_student_permissions.status_code == 403
        and response_syndicus_permissions.status_code == 403
    )


@pytest.mark.django_db
def test_post_auth_success_return_201():
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response_super_student_permissions = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert response_super_student_permissions.status_code == 201


@pytest.mark.django_db
def test_post_auth_failed_return_403():
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    student = insert_dummy_student(email="student@gmail.com", is_super_student=False)
    user = User.objects.create_user(username="syndicus@gmail.com", password="test")
    insert_dummy_syndicus(user=user)

    response_no_auth = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.force_login(student.user)
    response_student_permissions = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.login(username="syndicus@gmail.com", password="test")
    response_syndicus_permissions = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert (
        response_no_auth.status_code == 403
        and response_student_permissions.status_code == 403
        and response_syndicus_permissions.status_code == 403
    )


@pytest.mark.django_db
def test_put_auth_success_return_200():
    dummy_entry = insert_dummy_garbage_type()
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response_super_student_permissions = client.put(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert response_super_student_permissions.status_code == 200


@pytest.mark.django_db
def test_put_auth_failed_return_403():
    dummy_entry = insert_dummy_garbage_type()
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    student = insert_dummy_student(email="student@gmail.com", is_super_student=False)
    user = User.objects.create_user(username="syndicus@gmail.com", password="test")
    insert_dummy_syndicus(user=user)

    response_no_auth = client.put(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.force_login(student.user)
    response_student_permissions = client.put(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.login(username="syndicus@gmail.com", password="test")
    response_syndicus_permissions = client.put(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert (
        response_no_auth.status_code == 403
        and response_student_permissions.status_code == 403
        and response_syndicus_permissions.status_code == 403
    )


@pytest.mark.django_db
def test_patch_auth_success_return_200():
    dummy_entry = insert_dummy_garbage_type()
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response_super_student_permissions = client.patch(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert response_super_student_permissions.status_code == 200


@pytest.mark.django_db
def test_patch_auth_failed_return_403():
    dummy_entry = insert_dummy_garbage_type()
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    student = insert_dummy_student(email="student@gmail.com", is_super_student=False)
    user = User.objects.create_user(username="syndicus@gmail.com", password="test")
    insert_dummy_syndicus(user=user)

    response_no_auth = client.patch(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.force_login(student.user)
    response_student_permissions = client.patch(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )
    client.login(username="syndicus@gmail.com", password="test")
    response_syndicus_permissions = client.patch(
        f"/garbage_type/{dummy_entry.id}/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert (
        response_no_auth.status_code == 403
        and response_student_permissions.status_code == 403
        and response_syndicus_permissions.status_code == 403
    )
