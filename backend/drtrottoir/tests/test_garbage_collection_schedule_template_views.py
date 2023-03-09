import json

import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_student,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_template_forbidden_methods():
    client = APIClient()

    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    assert client.get("/garbage_collection_schedule_templates/").status_code == 405
    assert client.patch("/garbage_collection_schedule_templates/").status_code == 405
    assert client.delete("/garbage_collection_schedule_templates/").status_code == 405
    assert client.put("/garbage_collection_schedule_templates/").status_code == 405


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get_detail():
    template = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)
    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")

    assert (
        response.data["id"] == template.id
        and response.data["building"] == template.building.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post():
    building = insert_dummy_building()

    data = {"name": "dummy schedule", "building": building.id}

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.post(
        "/garbage_collection_schedule_templates/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.data == {"id": 1, "name": "dummy schedule", "building": building.id}
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_delete():
    template = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.delete(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.status_code == 204

    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch():
    template = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    data = {"name": "new name"}

    client.patch(f"/garbage_collection_schedule_templates/{template.id}/", data)

    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.data["name"] == "new name"
