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


def _test_garbage_collection_schedule_template_get_detail(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    template = insert_dummy_garbage_collection_schedule_template()

    return template, client.get(
        f"/garbage_collection_schedule_templates/{template.id}/"
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get_detail_success():
    student = insert_dummy_student(is_super_student=True)
    template, res = _test_garbage_collection_schedule_template_get_detail(student.user)

    assert (
        res.status_code == 200
        and res.data["id"] == template.id
        and res.data["building"] == template.building.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get_detail_fail():
    _, res = _test_garbage_collection_schedule_template_get_detail()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, res = _test_garbage_collection_schedule_template_get_detail(student.user)

    assert res.status_code == 403


def _test_garbage_collection_schedule_template_post(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    building = insert_dummy_building()

    data = {"name": "dummy schedule", "building": building.id}

    return (
        building,
        data,
        client.post(
            "/garbage_collection_schedule_templates/",
            json.dumps(data),
            content_type="application/json",
        ),
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post_success():
    student = insert_dummy_student(is_super_student=True)
    building, data, res = _test_garbage_collection_schedule_template_post(student.user)

    assert (
        res.status_code == 201
        and res.data["name"] == "dummy schedule"
        and res.data["building"] == building.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post_fail():
    _, _, res = _test_garbage_collection_schedule_template_post()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, _, res = _test_garbage_collection_schedule_template_post(student.user)
    assert res.status_code == 403


def _test_garbage_collection_schedule_template_delete(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    template = insert_dummy_garbage_collection_schedule_template()

    return client.delete(
        f"/garbage_collection_schedule_templates/{template.id}/"
    ), client.get(f"/garbage_collection_schedule_templates/{template.id}/")


@pytest.mark.django_db
def test_garbage_collection_schedule_template_delete_success():
    student = insert_dummy_student(is_super_student=True)
    res1, res2 = _test_garbage_collection_schedule_template_delete(student.user)

    assert res1.status_code == 204 and res2.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_template_delete_fail():
    res1, res2 = _test_garbage_collection_schedule_template_delete()

    assert res1.status_code == 403 and res2.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    res1, res2 = _test_garbage_collection_schedule_template_delete(student.user)
    assert res1.status_code == 403 and res2.status_code == 403


def _test_garbage_collection_schedule_template_patch(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    template = insert_dummy_garbage_collection_schedule_template()
    data = {"name": "new name"}

    return client.patch(
        f"/garbage_collection_schedule_templates/{template.id}/", data
    ), client.get(f"/garbage_collection_schedule_templates/{template.id}/")


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch_success():
    student = insert_dummy_student(is_super_student=True)

    res1, res2 = _test_garbage_collection_schedule_template_patch(student.user)

    assert (
        res1.status_code == 200
        and res2.status_code == 200
        and res2.data["name"] == "new name"
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch_fail():
    res1, res2 = _test_garbage_collection_schedule_template_patch()

    assert res1.status_code == 403 and res2.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    res1, res2 = _test_garbage_collection_schedule_template_patch(student.user)
    assert res1.status_code == 403 and res2.status_code == 403
