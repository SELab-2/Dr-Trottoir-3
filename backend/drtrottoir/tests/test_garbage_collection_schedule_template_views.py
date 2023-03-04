import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule_template,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get_list():
    template_1 = insert_dummy_garbage_collection_schedule_template()
    template_2 = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    response = client.get("/garbage_collection_schedule_templates/")

    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([template_1.id, template_2.id])


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get_detail():
    template = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")

    assert (
        response.data["id"] == template.id
        and response.data["building"] == template.building.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post():
    building = insert_dummy_building()

    data = {"name": "dummy schedule", "building": building.id}

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)

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

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)

    response = client.delete(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.status_code == 204

    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_garbage_collection_schedule_template_patch():
    template = insert_dummy_garbage_collection_schedule_template()

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)

    data = {"name": "new name"}

    client.patch(f"/garbage_collection_schedule_templates/{template.id}/", data)

    response = client.get(f"/garbage_collection_schedule_templates/{template.id}/")
    assert response.data["name"] == "new name"
