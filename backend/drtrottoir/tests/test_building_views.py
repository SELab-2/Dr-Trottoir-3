import datetime
import tempfile

import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_issue,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_syndicus,
    insert_dummy_student,
    insert_dummy_user,
)


@pytest.mark.django_db
def test_buildings_get_list():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    non_existent_building_id = dummy_building_1.id + dummy_building_2.id

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get("/buildings/")

    response_ids = [e["id"] for e in response.data]
    assert dummy_building_1.id in response_ids
    assert dummy_building_2.id in response_ids
    assert non_existent_building_id not in response_ids
    assert response.status_code == 200


@pytest.mark.django_db
def test_buildings_get_list_forbidden():
    user = insert_dummy_user()
    client = APIClient()
    client.force_login(user)
    response = client.get("/buildings/")
    assert response.status_code == 403


@pytest.mark.django_db
def test_buildings_post():
    dummy_location_group = insert_dummy_location_group()

    tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_file.write(b"Hello world!")
    tmp_file.seek(0)

    data = {
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        "pdf_guide": tmp_file,
    }
    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.post("/buildings/", data)

    assert response.data["id"] == 1
    assert response.data["address"] == "address 1"
    assert response.data["is_active"]
    assert response.data["location_group"] == dummy_location_group.id
    assert response.data["pdf_guide"].endswith(".pdf")
    assert response.status_code == 201


@pytest.mark.django_db
def test_buildings_post_forbidden():
    dummy_location_group = insert_dummy_location_group()

    tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_file.write(b"Hello world!")
    tmp_file.seek(0)

    data = {
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        "pdf_guide": tmp_file,
    }
    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.post("/buildings/", data)
    assert response.status_code == 403


@pytest.mark.django_db
def test_buildings_patch_with_file():
    dummy_building = insert_dummy_building()

    tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_file.write(b"Hello world!")
    tmp_file.seek(0)

    data = {
        "pdf_guide": tmp_file,
    }
    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.patch(f"/buildings/{dummy_building.id}/", data)

    assert response.data["id"] == dummy_building.id
    assert response.data["address"] == dummy_building.address
    assert response.data["is_active"] == dummy_building.is_active
    assert response.data["pdf_guide"].endswith(".pdf")
    assert response.status_code == 200


@pytest.mark.django_db
def test_building_get_detail():
    dummy_building = insert_dummy_building()
    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(f"/buildings/{dummy_building.id}/")

    assert (
        dummy_building.id == response.data["id"]
        and dummy_building.address == response.data["address"]
        and dummy_building.pdf_guide == response.data["pdf_guide"]
        and dummy_building.is_active == response.data["is_active"]
        and dummy_building.location_group.id == response.data["location_group"]
    )


@pytest.mark.django_db
def test_building_patch_detail():
    dummy_building = insert_dummy_building()
    dummy_location_group = insert_dummy_location_group()

    tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_file.write(b"Hello world!")
    tmp_file.seek(0)

    data = {
        "address": "address 1",
        "pdf_guide": tmp_file,
        "is_active": True,
        "location_group": dummy_location_group.id,
    }

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.patch(f"/buildings/{dummy_building.id}/", data)

    assert response.data["id"] == 1
    assert response.data["address"] == "address 1"
    assert response.data["is_active"]
    assert response.data["location_group"] == dummy_location_group.id
    assert response.data["pdf_guide"].endswith(".pdf")
    assert response.status_code == 200


@pytest.mark.django_db
def test_building_patch_detail_fobridden():
    dummy_building = insert_dummy_building()

    data = {
        "address": "address 1",
    }

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.patch(f"/buildings/{dummy_building.id}/", data)
    assert response.status_code == 403


@pytest.mark.django_db
def test_building_delete_detail():
    dummy_building = insert_dummy_building()

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.delete(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 204
    response = client.get(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_building_delete_detail_forbidden():
    dummy_building = insert_dummy_building()

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.delete(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 403
    response = client.get(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_get_buildings_from_syndicus():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    dummy_building_3 = insert_dummy_building()

    dummy_syndicus = insert_dummy_syndicus(
        buildings=[dummy_building_1, dummy_building_2]
    )

    client = APIClient()
    client.force_login(dummy_syndicus.user)
    response = client.get(f"/buildings/users/{dummy_syndicus.user_id}/")

    response_ids = [e["id"] for e in response.data]
    assert dummy_building_1.id in response_ids
    assert dummy_building_2.id in response_ids
    assert dummy_building_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedule_definitions_list():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    dummy_schedule_definition_1 = insert_dummy_schedule_definition(
        buildings=[dummy_building_1]
    )
    dummy_schedule_definition_2 = insert_dummy_schedule_definition(
        buildings=[dummy_building_1]
    )
    dummy_schedule_definition_3 = insert_dummy_schedule_definition(
        buildings=[dummy_building_2]
    )

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(f"/buildings/{dummy_building_1.id}/schedule_definitions/")

    response_ids = [e["id"] for e in response.data]

    assert dummy_schedule_definition_1.id in response_ids
    assert dummy_schedule_definition_2.id in response_ids
    assert dummy_schedule_definition_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_issues_list():
    user = insert_dummy_student(email="student@mail.com").user
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    issue_1 = insert_dummy_issue(user, building_1)
    issue_2 = insert_dummy_issue(user, building_1)
    issue_3 = insert_dummy_issue(user, building_2)

    dummy_syndicus = insert_dummy_syndicus(
        buildings=[building_1, building_2], email="syndicus@mail.com"
    )

    client = APIClient()
    client.force_login(dummy_syndicus.user)
    response = client.get(f"/buildings/{building_1.id}/issues/")
    response_ids = [e["id"] for e in response.data]

    assert issue_1.id in response_ids
    assert issue_2.id in response_ids
    assert issue_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedule_templates_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    template_1 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_2 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_3 = insert_dummy_garbage_collection_schedule_template(building_2)

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(
        f"/buildings/{building_1.id}/garbage_collection_schedule_templates/"
    )
    response_ids = [e["id"] for e in response.data]

    assert template_1.id in response_ids
    assert template_2.id in response_ids
    assert template_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedules_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    schedule_1 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_2 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_3 = insert_dummy_garbage_collection_schedule(building_2)

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(f"/buildings/{building_1.id}/garbage_collection_schedules/")
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids


@pytest.mark.django_db
def test_building_get_schedules_by_date_list():
    building_1 = insert_dummy_building()
    schedule_1 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 1, 3)
    )
    schedule_2 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 1, 3)
    )
    schedule_3 = insert_dummy_garbage_collection_schedule(
        building_1, date=datetime.date(2023, 2, 3)
    )

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(
        f"/buildings/{building_1.id}/for_day/{schedule_1.for_day}"
        f"/garbage_collection_schedules/"
    )
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids
