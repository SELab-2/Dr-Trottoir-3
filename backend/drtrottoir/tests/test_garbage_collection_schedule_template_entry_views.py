import json

import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_garbage_collection_schedule_template_entry,
    insert_dummy_garbage_type,
    insert_dummy_student,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_template_forbidden_methods():
    client = APIClient()

    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    assert (
        client.get("/garbage_collection_schedule_template_entries/").status_code == 405
    )
    assert (
        client.patch("/garbage_collection_schedule_template_entries/").status_code
        == 405
    )
    assert (
        client.delete("/garbage_collection_schedule_template_entries/").status_code
        == 405
    )
    assert (
        client.put("/garbage_collection_schedule_template_entries/").status_code == 405
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_get_detail():
    entry = insert_dummy_garbage_collection_schedule_template_entry()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)
    response = client.get(f"/garbage_collection_schedule_template_entries/{entry.id}/")

    assert (
        response.data["id"] == entry.id
        and response.data["garbage_type"] == entry.garbage_type.id
        and response.data["garbage_collection_schedule_template"]
        == entry.garbage_collection_schedule_template.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post():
    template = insert_dummy_garbage_collection_schedule_template()
    garbage_type = insert_dummy_garbage_type()

    data = {
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)
    response = client.post(
        "/garbage_collection_schedule_template_entries/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.data == {
        "id": 1,
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_delete():
    entry = insert_dummy_garbage_collection_schedule_template_entry()

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    response = client.delete(
        f"/garbage_collection_schedule_template_entries/{entry.id}/"
    )
    assert response.status_code == 204

    response = client.get(f"/garbage_collection_schedule_template_entries/{entry.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch():
    entry = insert_dummy_garbage_collection_schedule_template_entry()
    old_day = entry.day
    new_day = 7 if old_day != 7 else 6

    client = APIClient()
    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)

    data = {"day": new_day}

    client.patch(f"/garbage_collection_schedule_template_entries/{entry.id}/", data)

    response = client.get(f"/garbage_collection_schedule_template_entries/{entry.id}/")
    assert response.data["day"] == new_day
