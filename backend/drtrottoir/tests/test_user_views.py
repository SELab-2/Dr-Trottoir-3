import pytest
from rest_framework.test import APIClient

from .dummy_data import insert_dummy_admin, insert_dummy_student, insert_dummy_syndicus


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

    assert res.status_code == 200 and sorted(
        [x["id"] for x in res.data["results"]]
    ) == sorted([x.id for x in users] + [student.user.id])


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

    assert res.status_code == 200 and sorted(
        [x["id"] for x in res.data["results"]]
    ) == sorted([x.user.id for x in students] + [student.user.id])


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

    assert res.status_code == 200 and sorted(
        [x["id"] for x in res.data["results"]]
    ) == sorted([x.user.id for x in admins])


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

    assert res.status_code == 200 and sorted(
        [x["id"] for x in res.data["results"]]
    ) == sorted([x.user.id for x in syndici])


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
