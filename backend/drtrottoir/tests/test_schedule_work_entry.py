import tempfile
import json

import pytest
from PIL import Image
from rest_framework.test import APIClient

from drtrottoir.tests.dummy_data import (
    insert_dummy_building,
    insert_dummy_schedule_definition,
    insert_dummy_schedule_work_entry,
    insert_dummy_student,
    insert_dummy_user,
    insert_dummy_schedule_assignment,
)
from drtrottoir.tests.util import date_equals


@pytest.mark.django_db
def test_schedule_work_entry_list_get() -> None:
    user = insert_dummy_user()
    work_entry1 = insert_dummy_schedule_work_entry(user).id
    work_entry2 = insert_dummy_schedule_work_entry(user).id
    work_entry_nonexistent = work_entry1 + work_entry2 + 3

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get("/schedule_work_entries/")
    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert work_entry1 in response_ids
    assert work_entry2 in response_ids
    assert work_entry_nonexistent not in response_ids


@pytest.mark.django_db
def test_schedule_work_entry_post_creator() -> None:
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition()
    creation_timestamp = "2222-02-02 22:22"

    image = Image.new("RGB", (100, 100))
    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)

    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.id,
        "building": building.id,
        "schedule_definition": schedule_definition.id,
        "creation_timestamp": creation_timestamp,
        "image": tmp_file,
    }

    client = APIClient()
    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 201
    assert response.data["id"] > 0
    assert response.data["creator"] == creator.user.id
    assert response.data["building"] == building.id
    assert response.data["schedule_definition"] == schedule_definition.id
    assert date_equals(response.data["creation_timestamp"], creation_timestamp)
    assert response.data["image"].endswith(".jpg")


@pytest.mark.django_db
def test_schedule_work_entry_post_no_extension() -> None:
    creator = insert_dummy_user()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition()
    creation_timestamp = "2222-02-02 22:22"

    image = Image.new("RGB", (100, 100))
    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)
    tmp_file.name = "tmp_file_no_ext"

    data = {
        "creator": creator.id,
        "building": building.id,
        "schedule_definition": schedule_definition.id,
        "creation_timestamp": creation_timestamp,
        "image": tmp_file,
    }

    client = APIClient()
    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_work_entry_post_other() -> None:
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    creation_timestamp = "2222-02-02 22:22"
    image_path = "pics/image.jpg"

    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_definition": schedule_definition.id,
        "creation_timestamp": creation_timestamp,
        "image_path": image_path,
    }

    client = APIClient()
    other_student = insert_dummy_student("other@gmail.com")
    client.force_login(other_student.user)

    response = client.post(
        "/schedule_work_entries/", json.dumps(data), content_type="application/json"
    )

    assert response.status_code == 403


@pytest.mark.django_db
def test_schedule_work_entry_get() -> None:
    user = insert_dummy_user()
    work_entry = insert_dummy_schedule_work_entry(user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_work_entries/{work_entry.id}/")

    assert response.status_code == 200
    assert response.data["id"] == work_entry.id
    assert response.data["building"] == work_entry.building.id

    # Test nonexistent entry
    work_entry_nonexistent = work_entry.id + 3
    response = client.get(f"/schedule_work_entries/{work_entry_nonexistent}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_id() -> None:
    student = insert_dummy_student()
    work_entry = insert_dummy_schedule_work_entry(student.user)

    client = APIClient()
    client.force_login(student.user)

    response = client.get(f"/schedule_work_entries/users/{student.user.id}/")
    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert work_entry.id in response_ids


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_other_student() -> None:
    student = insert_dummy_student()
    insert_dummy_schedule_work_entry(student.user)

    client = APIClient()
    other_student = insert_dummy_student("other@gmail.com")
    client.force_login(other_student.user)

    response = client.get(f"/schedule_work_entries/users/{student.user.id}/")

    assert response.status_code == 403


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_anonymous() -> None:
    student = insert_dummy_student()
    client = APIClient()
    # No login here
    response = client.get(f"/schedule_work_entries/users/{student.user.id}/")

    assert response.status_code == 403
