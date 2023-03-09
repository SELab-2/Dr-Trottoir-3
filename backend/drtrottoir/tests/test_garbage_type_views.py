import json

import pytest
from rest_framework.test import APIClient

from .dummy_data import insert_dummy_garbage_type, insert_dummy_student


@pytest.mark.django_db
def test_garbage_type_post():
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)

    client.force_login(student.user)

    client.force_login(student.user)
    response_succes = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert response_succes.data == {"id": 1, "name": "dummy garbage type"}
    assert response_succes.status_code == 201


@pytest.mark.django_db
def test_garbage_type_api_view_get():
    dummy_entry_1 = insert_dummy_garbage_type()
    dummy_entry_2 = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(is_super_student=False)
    client.force_login(student.user)

    response = client.get("/garbage_type/")
    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([dummy_entry_1.id, dummy_entry_2.id])
    assert response.status_code == 200


@pytest.mark.django_db
def test_garbage_type_get_detail():
    dummy_entry = insert_dummy_garbage_type()

    client = APIClient()
    student = insert_dummy_student(is_super_student=False)
    client.force_login(student.user)

    response = client.get(f"/garbage_type/{dummy_entry.id}/")

    assert (
        response.data["id"] == dummy_entry.id
        and response.data["name"] == dummy_entry.name
    )


@pytest.mark.django_db
def test_garbage_type_no_post_auth():
    dummy_garbage_type_data = {"name": "dummy garbage type"}

    client = APIClient()

    response = client.post(
        "/garbage_type/",
        json.dumps(dummy_garbage_type_data),
        content_type="application/json",
    )

    assert response.status_code == 403

@pytest.mark.django_db
def test_garbage_type_no_get_auth():

    client = APIClient()

    assert client.get("/garbage_type/").status_code == 403
