import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_schedule_assignment,
    insert_dummy_schedule_definition,
    insert_dummy_schedule_work_entry,
    insert_dummy_student,
)


@pytest.mark.django_db
def test_schedule_definition_forbidden_methods():
    client = APIClient()

    student = insert_dummy_student(is_super_student=True)
    client.force_login(student.user)
    sched = insert_dummy_schedule_definition()

    assert client.patch(f"/schedule_definitions/{sched.id}/").status_code == 405
    assert client.delete(f"/schedule_definitions/{sched.id}/").status_code == 405
    assert client.delete("/schedule_definitions/").status_code == 405
    assert client.put("/schedule_definitions/").status_code == 405


def _test_schedule_definition_list(user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    schedule1 = insert_dummy_schedule_definition(name="dummy 1")
    schedule2 = insert_dummy_schedule_definition(name="dummy 2")

    return [schedule1, schedule2], client.get("/schedule_definitions/")


@pytest.mark.django_db
def test_schedule_definition_list_success():
    student = insert_dummy_student(is_super_student=True)

    scheds, res = _test_schedule_definition_list(student.user)

    assert res.status_code == 200 and sorted([x["id"] for x in res.data]) == sorted(
        [x.id for x in scheds]
    )


@pytest.mark.django_db
def test_schedule_definition_list_fail():
    _, res = _test_schedule_definition_list()
    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)
    _, res = _test_schedule_definition_list(student.user)
    assert res.status_code == 403


def _test_schedule_definition_detail(assignment_user, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    assignment = insert_dummy_schedule_assignment(assignment_user)
    def_id = assignment.schedule_definition.id

    return assignment, client.get(f"/schedule_definitions/{def_id}/")


@pytest.mark.django_db
def test_schedule_definition_detail_success():
    student = insert_dummy_student()

    assignment, res = _test_schedule_definition_detail(student.user, student.user)
    sched = assignment.schedule_definition

    assert res.status_code == 200 and res.data["id"] == sched.id


@pytest.mark.django_db
def test_schedule_definition_detail_fail():
    assignment_student = insert_dummy_student(email="assignment@student.com")

    _, res = _test_schedule_definition_detail(assignment_student.user)

    assert res.status_code == 403

    student = insert_dummy_student()
    _, res = _test_schedule_definition_detail(assignment_student.user, student.user)

    assert res.status_code == 403


def _test_schedule_definition_buildings(assignment_user, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    assignment = insert_dummy_schedule_assignment(assignment_user)
    sched = assignment.schedule_definition

    return assignment, client.get(f"/schedule_definitions/{sched.id}/buildings/")


@pytest.mark.django_db
def test_schedule_definition_buildings_success():
    student = insert_dummy_student()
    assignment, res = _test_schedule_definition_buildings(student.user, student.user)

    assert res.status_code == 200 and sorted(x["id"] for x in res.data) == sorted(
        x.id for x in assignment.schedule_definition.buildings.all()
    )


@pytest.mark.django_db
def test_schedule_definition_buildings_fail():
    assignment_student = insert_dummy_student(email="assignment@student.com")

    _, res = _test_schedule_definition_buildings(assignment_student.user)

    assert res.status_code == 403

    student = insert_dummy_student()
    _, res = _test_schedule_definition_buildings(assignment_student.user, student.user)

    assert res.status_code == 403


def _test_schedule_definition_schedule_assignments(assignment_user, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    assignment = insert_dummy_schedule_assignment(assignment_user)
    sched = assignment.schedule_definition

    return assignment, client.get(
        f"/schedule_definitions/{sched.id}/schedule_assignments/"
    )


@pytest.mark.django_db
def test_schedule_definition_schedule_assignments_success():
    student1 = insert_dummy_student(email="student1@mail.com")
    student2 = insert_dummy_student(is_super_student=True)
    assignment, res = _test_schedule_definition_schedule_assignments(
        student1.user, student2.user
    )

    assert res.status_code == 200 and [x["id"] for x in res.data] == [assignment.id]


@pytest.mark.django_db
def test_schedule_definition_schedule_assignments_fail():
    assignment_student = insert_dummy_student(email="assignment@student.com")

    _, res = _test_schedule_definition_schedule_assignments(assignment_student.user)

    assert res.status_code == 403

    student = insert_dummy_student()
    _, res = _test_schedule_definition_schedule_assignments(
        assignment_student.user, student.user
    )

    assert res.status_code == 403


def _test_schedule_definition_schedule_work_entries(creator, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    work_entry = insert_dummy_schedule_work_entry(creator)
    sched = work_entry.schedule_definition

    return work_entry, client.get(
        f"/schedule_definitions/{sched.id}/schedule_work_entries/"
    )


@pytest.mark.django_db
def test_schedule_definition_schedule_work_entries_success():
    student = insert_dummy_student(is_super_student=True)
    work_entry, res = _test_schedule_definition_schedule_work_entries(
        student.user, student.user
    )

    assert res.status_code == 200 and [x["id"] for x in res.data] == [work_entry.id]


@pytest.mark.django_db
def test_schedule_definition_schedule_work_entries_fail():
    creator_student = insert_dummy_student(email="assignment@student.com")

    _, res = _test_schedule_definition_schedule_work_entries(creator_student.user)

    assert res.status_code == 403

    student = insert_dummy_student()
    _, res = _test_schedule_definition_schedule_work_entries(
        creator_student.user, student.user
    )

    assert res.status_code == 403
