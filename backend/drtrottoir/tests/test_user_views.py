import json

import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_location_group,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)


def insert_dummy_users():
    syndici = [
        insert_dummy_syndicus(email="syndicus1@email.com"),
        insert_dummy_syndicus(email="syndicus2@email.com"),
    ]
    students = [
        insert_dummy_student(email="student1@email.com"),
        insert_dummy_student(email="student2@email.com"),
    ]
    admins = [
        insert_dummy_admin(email="admin1@email.com"),
        insert_dummy_admin(email="admin2@email.com"),
    ]

    return syndici, students, admins


def _test_users_get_all(user=None, populate=True):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    if populate:
        syndici, students, admins = insert_dummy_users()

        return syndici, students, admins, client.get("/users/")

    return [], [], [], client.get("/users/")


@pytest.mark.django_db
def test_users_get_all_success():
    student = insert_dummy_student(is_super_student=True)

    syndici, students, admins, res = _test_users_get_all(student.user)
    users = [x.user for x in syndici + students + admins]

    assert res.status_code == 200 and sorted([x["id"] for x in res.data]) == sorted(
        [x.id for x in users] + [student.user.id]
    )


@pytest.mark.django_db
def test_users_get_all_fail():
    _, _, _, res = _test_users_get_all()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    _, _, _, res = _test_users_get_all(student.user, False)

    assert res.status_code == 403


def _test_users_get_students(user=None, populate=True):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    if populate:
        _, students, _ = insert_dummy_users()

        return students, client.get("/users/students/")

    return [], client.get("/users/students/")


@pytest.mark.django_db
def test_users_get_students_success():
    student = insert_dummy_student(is_super_student=True)

    students, res = _test_users_get_students(student.user)

    assert res.status_code == 200 and sorted([x["id"] for x in res.data]) == sorted(
        [x.user.id for x in students] + [student.user.id]
    )


@pytest.mark.django_db
def test_users_get_students_fail():
    _, res = _test_users_get_students()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    _, res = _test_users_get_students(student.user, False)

    assert res.status_code == 403


def _test_users_get_admins(user=None, populate=True):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    if populate:
        _, _, admins = insert_dummy_users()

        return admins, client.get("/users/admins/")

    return [], client.get("/users/admins/")


@pytest.mark.django_db
def test_users_get_admins_success():
    student = insert_dummy_student(is_super_student=True)

    admins, res = _test_users_get_admins(student.user)

    assert res.status_code == 200 and sorted([x["id"] for x in res.data]) == sorted(
        [x.user.id for x in admins]
    )


@pytest.mark.django_db
def test_users_get_admins_fail():
    _, res = _test_users_get_admins()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    _, res = _test_users_get_admins(student.user, False)

    assert res.status_code == 403


def _test_users_get_syndici(user=None, populate=True):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    if populate:
        syndici, _, _ = insert_dummy_users()

        return syndici, client.get("/users/syndici/")

    return [], client.get("/users/syndici/")


@pytest.mark.django_db
def test_users_get_syndici_success():
    student = insert_dummy_student(is_super_student=True)

    syndici, res = _test_users_get_syndici(student.user)

    assert res.status_code == 200 and sorted([x["id"] for x in res.data]) == sorted(
        [x.user.id for x in syndici]
    )


@pytest.mark.django_db
def test_users_get_syndici_fail():
    _, res = _test_users_get_syndici()

    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    _, res = _test_users_get_syndici(student.user, False)

    assert res.status_code == 403


@pytest.mark.django_db
def test_users_me_success():
    student = insert_dummy_student(is_super_student=False)

    client = APIClient()
    client.force_login(student.user)
    res = client.get("/users/me/")

    assert res.status_code == 200 and res.data["id"] == student.user.id


def test_users_me_failure():
    client = APIClient()
    res = client.get("/users/me/")

    assert res.status_code == 403


def _test_user_create(data, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    return client.post("/users/", json.dumps(data), content_type="application/json")


@pytest.mark.django_db
def test_user_create_forbidden():
    res = _test_user_create({})
    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    res = _test_user_create({}, user=student.user)
    assert res.status_code == 403

    student = insert_dummy_student(
        email="test-super@student.com", is_super_student=True
    )

    res = _test_user_create({}, user=student.user)
    assert res.status_code == 400


@pytest.mark.django_db
def test_user_create_no_relations():
    data = {
        "username": "test-post@email.com",
        "first_name": "Test",
        "last_name": "User",
        "admin": None,
        "student": None,
        "syndicus": None,
    }

    student = insert_dummy_student(is_super_student=True)

    res = _test_user_create(data, user=student.user)
    res.data.pop("id")
    res.data.pop("invite_link")
    assert res.status_code == 201 and res.data == data


@pytest.mark.django_db
def test_user_create_admin():
    data = {
        "username": "test-post@email.com",
        "first_name": "Test",
        "last_name": "User",
        "admin": {},
        "student": None,
        "syndicus": None,
    }

    student = insert_dummy_student(is_super_student=True)

    res = _test_user_create(data, user=student.user)
    res.data.pop("id")
    res.data.pop("invite_link")
    assert res.status_code == 201 and res.data == data


@pytest.mark.django_db
def test_user_create_student():
    lg = insert_dummy_location_group()

    data = {
        "username": "test-post@email.com",
        "first_name": "Test",
        "last_name": "User",
        "admin": None,
        "student": {"location_group": lg.id, "is_super_student": True},
        "syndicus": None,
    }

    student = insert_dummy_student(is_super_student=True)

    res = _test_user_create(data, user=student.user)
    res.data.pop("id")
    res.data.pop("invite_link")
    assert res.status_code == 201 and res.data == data


@pytest.mark.django_db
def test_user_create_syndicus():
    b = insert_dummy_building()

    data = {
        "username": "test-post@email.com",
        "first_name": "Test",
        "last_name": "User",
        "admin": None,
        "student": None,
        "syndicus": {"buildings": [b.id]},
    }

    student = insert_dummy_student(is_super_student=True)

    res = _test_user_create(data, user=student.user)
    res.data.pop("id")
    res.data.pop("invite_link")
    res.data["syndicus"].pop("id")
    assert res.status_code == 201 and res.data == data


def _test_user_patch(user_to_patch, data, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    return client.patch(
        f"/users/{user_to_patch.id}/", json.dumps(data), content_type="application/json"
    )


@pytest.mark.django_db
def test_user_patch_forbidden():
    user_to_patch = insert_dummy_user()

    res = _test_user_patch(user_to_patch, {})
    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    res = _test_user_patch(user_to_patch, {}, user=student.user)
    assert res.status_code == 403

    student = insert_dummy_student(
        email="test-super@student.com", is_super_student=True
    )

    res = _test_user_patch(user_to_patch, {}, user=student.user)
    assert res.status_code == 200


@pytest.mark.django_db
def test_user_patch_user_field():
    user_to_patch = insert_dummy_user()
    student = insert_dummy_student(is_super_student=True)

    data = {"first_name": "new name"}

    res = _test_user_patch(user_to_patch, data, user=student.user)

    assert res.status_code == 200 and res.data["first_name"] == data["first_name"]


@pytest.mark.django_db
def test_user_patch_student_field():
    student_to_patch = insert_dummy_student(is_super_student=False)
    student = insert_dummy_student(
        email="test-super@student.com", is_super_student=True
    )

    data = {"student": {"is_super_student": True}}

    res = _test_user_patch(student_to_patch.user, data, user=student.user)

    assert res.status_code == 200 and res.data["student"]["is_super_student"] is True


@pytest.mark.django_db
def test_user_patch_syndicus_buildings():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()

    syndicus_to_patch = insert_dummy_syndicus()
    student = insert_dummy_student(
        email="test-super@student.com", is_super_student=True
    )

    data = {"syndicus": {"buildings": [dummy_building_1.id, dummy_building_2.id]}}

    res = _test_user_patch(syndicus_to_patch.user, data, user=student.user)

    assert res.status_code == 200 and sorted(
        res.data["syndicus"]["buildings"]
    ) == sorted([dummy_building_1.id, dummy_building_2.id])


def _test_user_delete(user_to_delete, user=None):
    client = APIClient()

    if user is not None:
        client.force_login(user)

    return client.delete(f"/users/{user_to_delete.id}/")


@pytest.mark.django_db
def test_user_delete_forbidden():
    user_to_delete = insert_dummy_user()

    res = _test_user_delete(user_to_delete)
    assert res.status_code == 403

    student = insert_dummy_student(is_super_student=False)

    res = _test_user_delete(user_to_delete, user=student.user)
    assert res.status_code == 403

    student = insert_dummy_student(
        email="test-super@student.com", is_super_student=True
    )

    res = _test_user_delete(user_to_delete, user=student.user)
    assert res.status_code == 204
