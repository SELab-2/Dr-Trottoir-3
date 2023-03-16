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


def _test_garbage_collection_schedule_template_entry_get_detail(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    entry = insert_dummy_garbage_collection_schedule_template_entry()
    return entry, client.get(
        f"/garbage_collection_schedule_template_entries/{entry.id}/"
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_get_detail_success():
    student = insert_dummy_student(is_super_student=True)
    entry, response = _test_garbage_collection_schedule_template_entry_get_detail(
        student.user
    )

    assert (
        response.data["id"] == entry.id
        and response.data["garbage_type"] == entry.garbage_type.id
        and response.data["garbage_collection_schedule_template"]
        == entry.garbage_collection_schedule_template.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_get_detail_fail():
    _, response = _test_garbage_collection_schedule_template_entry_get_detail()

    assert response.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, response = _test_garbage_collection_schedule_template_entry_get_detail(
        student.user
    )

    assert response.status_code == 403


def _test_garbage_collection_schedule_template_entry_post(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    template = insert_dummy_garbage_collection_schedule_template()
    garbage_type = insert_dummy_garbage_type()

    data = {
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }

    return (
        template,
        garbage_type,
        client.post(
            "/garbage_collection_schedule_template_entries/",
            json.dumps(data),
            content_type="application/json",
        ),
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post_success():
    student = insert_dummy_student(is_super_student=True)
    (
        template,
        garbage_type,
        response,
    ) = _test_garbage_collection_schedule_template_entry_post(student.user)

    assert response.data["day"] == 4
    assert response.data["garbage_type"] == garbage_type.id
    assert response.data["garbage_collection_schedule_template"] == template.id
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post_fail():
    _, _, response = _test_garbage_collection_schedule_template_entry_post()

    assert response.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, _, response = _test_garbage_collection_schedule_template_entry_post(student.user)

    assert response.status_code == 403


def _test_garbage_collection_schedule_template_entry_delete(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    entry = insert_dummy_garbage_collection_schedule_template_entry()

    return (
        entry,
        client.delete(f"/garbage_collection_schedule_template_entries/{entry.id}/"),
        client.get(f"/garbage_collection_schedule_template_entries/{entry.id}/"),
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_success():
    student = insert_dummy_student(is_super_student=True)

    _, res1, res2 = _test_garbage_collection_schedule_template_entry_delete(
        student.user
    )

    assert res1.status_code == 204 and res2.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_fail():
    _, res1, res2 = _test_garbage_collection_schedule_template_entry_delete()
    assert res1.status_code == 403 and res2.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    _, res1, res2 = _test_garbage_collection_schedule_template_entry_delete(
        student.user
    )
    assert res1.status_code == 403 and res2.status_code == 403


def _test_garbage_collection_schedule_template_patch(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    entry = insert_dummy_garbage_collection_schedule_template_entry()
    old_day = entry.day
    new_day = 7 if old_day != 7 else 6

    data = {"day": new_day}

    return (
        data,
        client.patch(
            f"/garbage_collection_schedule_template_entries/{entry.id}/", data
        ),
        client.get(f"/garbage_collection_schedule_template_entries/{entry.id}/"),
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch_success():
    student = insert_dummy_student(is_super_student=True)
    data, res1, res2 = _test_garbage_collection_schedule_template_patch(student.user)

    assert (
        res1.status_code == 200
        and res2.status_code == 200
        and res2.data["day"] == data["day"]
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch_fail():
    _, res1, res2 = _test_garbage_collection_schedule_template_patch()

    assert res1.status_code == 403 and res2.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, res1, res2 = _test_garbage_collection_schedule_template_patch(student.user)

    assert res1.status_code == 403 and res2.status_code == 403
