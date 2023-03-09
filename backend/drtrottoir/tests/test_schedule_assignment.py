import json

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import ScheduleAssignment
from drtrottoir.tests.dummy_data import (
    insert_dummy_schedule_assignment,
    insert_dummy_schedule_definition,
    insert_dummy_student,
    insert_dummy_user,
)
from drtrottoir.tests.util import date_equals

# TODO proper authentication tests


@pytest.mark.django_db
def test_schedule_assignment_get_by_id() -> None:
    user = insert_dummy_user()
    assignment: ScheduleAssignment = insert_dummy_schedule_assignment(user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_assignments/{assignment.id}/")

    assert response.status_code == 200
    assert response.data["schedule_definition"] == assignment.schedule_definition.id
    assert response.data["user"] == user.id
    assert date_equals(response.data["assigned_date"], str(assignment.assigned_date))

    # Test nonexistent id
    assignment_id_nonexistent = assignment.id + 3
    response = client.get(f"/schedule_assignments/{assignment_id_nonexistent}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_post() -> None:
    dummy_user = insert_dummy_user()
    dummy_definition = insert_dummy_schedule_definition()
    dummy_date = "2000-01-01"

    data = {
        "user": dummy_user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": dummy_date,
    }

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    assert response.status_code == 201
    assert response.data["user"] == dummy_user.id
    assert response.data["schedule_definition"] == dummy_definition.id
    assert date_equals(dummy_date, response.data["assigned_date"])

    # A bit overkill, but make sure it actually exists
    assignment_id = response.data["id"]
    response = client.get(f"/schedule_assignments/{assignment_id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_delete() -> None:
    user = insert_dummy_user()
    assignment = insert_dummy_schedule_assignment(user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.delete(f"/schedule_assignments/{assignment.id}/")
    assert response.status_code == 204

    # Actually make sure the resource is deleted
    response = client.get(f"/schedule_assignments/{assignment.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_patch_user() -> None:
    user_1 = insert_dummy_user("test1@gmail.com")
    user_2 = insert_dummy_user("test2@gmail.com")
    assignment = insert_dummy_schedule_assignment(user_1)

    data = {"user": user_2.id}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.patch(
        f"/schedule_assignments/{assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.data["user"] == user_2.id
    assert response.data["schedule_definition"] == assignment.schedule_definition.id


@pytest.mark.django_db
def test_schedule_assignment_patch_other() -> None:
    # Tests whether changing something other than the user affects the data.
    # It shouldn't, as only the user can be changed.
    user = insert_dummy_user()
    assignment = insert_dummy_schedule_assignment(user)

    dummy_schedule = insert_dummy_schedule_definition()
    dummy_date = "2222-02-02"
    data = {"schedule_definition": dummy_schedule.id, "assigned_date": dummy_date}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.patch(
        f"/schedule_assignments/{assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.data["user"] == user.id
    assert response.data["schedule_definition"] == assignment.schedule_definition.id
    assert date_equals(response.data["assigned_date"], str(assignment.assigned_date))


@pytest.mark.django_db
def test_schedule_assignment_by_date_and_user() -> None:
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)

    client = APIClient()
    client.force_login(student.user)
    date = assignment.assigned_date
    response = client.get(f"/schedule_assignments/date/{date}/user/{student.user.id}/")
    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert assignment.id in response_ids


@pytest.mark.django_db
def test_schedule_assignment_by_date_and_user_anonymous() -> None:
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)

    client = APIClient()
    date = assignment.assigned_date
    response = client.get(f"/schedule_assignments/date/{date}/user/{student.user.id}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_by_date_and_user_super_student() -> None:
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)
    super_student = insert_dummy_student(email="super@gmail.com", is_super_student=True)

    client = APIClient()
    client.force_login(super_student.user)

    date = assignment.assigned_date
    response = client.get(f"/schedule_assignments/date/{date}/user/{student.user.id}/")

    assert response.status_code == 200
