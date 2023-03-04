import json
import pytest
from rest_framework.test import APIClient

from drtrottoir.models import User

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_type,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_post():
    building = insert_dummy_building()
    garbage_type = insert_dummy_garbage_type()
    data = {
        "for_day": "2002-03-17",
        "garbage_type": garbage_type.id,
        "building": building.id,
    }

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)
    response = client.post(
        "/garbage_collection_schedules/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.data == {
        "id": 1,
        "for_day": "2002-03-17",
        "garbage_type": garbage_type.id,
        "building": building.id,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_get_detail():
    entry = insert_dummy_garbage_collection_schedule()

    client = APIClient()
    response = client.get(f"/garbage_collection_schedules/{entry.id}/")

    assert (
        response.data["id"] == entry.id
        and response.data["garbage_type"] == entry.garbage_type.id
        and response.data["building"]
        == entry.building.id
    )


@pytest.mark.django_db
def test_garbage_collection_schedule_patch():
    entry = insert_dummy_garbage_collection_schedule()
    old_day = entry.for_day
    new_day = "2002-01-09" if old_day != "2002-01-09" else "2002-03-17"

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)

    data = {"for_day": new_day}

    client.patch(f"/garbage_collection_schedules/{entry.id}/", data)

    response = client.get(f"/garbage_collection_schedules/{entry.id}/")
    assert response.data["for_day"] == new_day


@pytest.mark.django_db
def test_garbage_collection_schedule_delete():
    entry = insert_dummy_garbage_collection_schedule()

    user = User.objects.create_user(username="test@gmail.com", password="test")

    client = APIClient()
    client.force_login(user)

    response = client.delete(
        f"/garbage_collection_schedules/{entry.id}/"
    )
    assert response.status_code == 204

    response = client.get(f"/garbage_collection_schedules/{entry.id}/")
    assert response.status_code == 404
