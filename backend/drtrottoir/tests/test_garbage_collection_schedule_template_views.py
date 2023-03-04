import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_garbage_collection_schedule_template_entry,
    insert_dummy_garbage_type,
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
def test_garbage_collection_schedule_template_get():
    template_1 = insert_dummy_garbage_collection_schedule_template()
    template_2 = insert_dummy_garbage_collection_schedule_template()

    client = APIClient()
    response = client.get("/garbage_collection_schedule_templates/")

    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([template_1.id, template_2.id])


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post():
    template = insert_dummy_garbage_collection_schedule_template()
    garbage_type = insert_dummy_garbage_type()

    data = {
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)
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
def test_garbage_collection_schedule_template_entry_get():
    entry_1 = insert_dummy_garbage_collection_schedule_template_entry()
    entry_2 = insert_dummy_garbage_collection_schedule_template_entry()

    client = APIClient()
    response = client.get("/garbage_collection_schedule_template_entries/")

    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([entry_1.id, entry_2.id])
