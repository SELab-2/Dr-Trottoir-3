import json
from typing import Any, Dict

import pytest
from rest_framework.test import APIClient

from drtrottoir.models import ScheduleAssignment
from drtrottoir.tests.dummy_data import (
    insert_dummy_admin,
    insert_dummy_schedule_assignment,
    insert_dummy_schedule_definition,
    insert_dummy_schedule_work_entry,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)
from drtrottoir.tests.util import date_equals

"""
Notes:
Some of the test names have a comment with "# noqa: E501". This is to prevent flake8 from complaining
about lines that are too long. It's better to have a test name that's too descriptive than one that's
not descriptive enough.
"""


# region Unit testing

# region POST


@pytest.mark.django_db
def test_schedule_assignment_post_proper_data_returns_201() -> None:
    dummy_student = insert_dummy_student()
    dummy_definition = insert_dummy_schedule_definition()
    dummy_date = "2000-01-01"

    data = {
        "user": dummy_student.user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": dummy_date,
    }

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    assert response.status_code == 201
    assert response.data["user"] == dummy_student.user.id
    assert response.data["schedule_definition"] == dummy_definition.id
    assert date_equals(dummy_date, response.data["assigned_date"])

    # Make sure it actually exists
    assignment_id = response.data["id"]
    response = client.get(f"/schedule_assignments/{assignment_id}/")
    assert response.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_post_improper_format_returns_400() -> None:
    dummy_student = insert_dummy_student()
    dummy_definition = insert_dummy_schedule_definition()
    wrong_dummy_date = "improperly formatted date string"

    data = {
        "user": dummy_student.user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": wrong_dummy_date,
    }

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_assignment_post_incomplete_data_returns_400() -> None:
    dummy_student = insert_dummy_student()
    dummy_definition = insert_dummy_schedule_definition()

    incomplete_data = {
        "user": dummy_student.user.id,
        "schedule_definition": dummy_definition.id,
    }

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.post(
        "/schedule_assignments/",
        json.dumps(incomplete_data),
        content_type="application/json",
    )

    assert response.status_code == 400


# endregion POST


# region GET item
@pytest.mark.django_db
def test_schedule_assignment_get_existing_returns_200() -> None:
    user = insert_dummy_user("user@gmail.com")
    assignment: ScheduleAssignment = insert_dummy_schedule_assignment(user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_assignments/{assignment.id}/")

    assert response.status_code == 200
    assert response.data["schedule_definition"] == assignment.schedule_definition.id
    assert response.data["user"] == user.id
    assert date_equals(response.data["assigned_date"], str(assignment.assigned_date))

    expected_fields = [
        "id",
        "assigned_date",
        "schedule_definition",
        "user",
        "buildings_count",
        "buildings_done",
        "buildings_to_do",
        "buildings_percentage",
    ]
    assert sorted(expected_fields) == sorted(list(response.data.keys()))


@pytest.mark.django_db
def test_schedule_assignment_get_non_existing_returns_404() -> None:
    non_exiting_assignment_id = 9999

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_assignments/{non_exiting_assignment_id}/")
    assert response.status_code == 404


# endregion GET item

# region DELETE


@pytest.mark.django_db
def test_schedule_assignment_delete_existing_returns_204() -> None:
    user = insert_dummy_user("user@gmail.com")
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
def test_schedule_assignment_delete_nonexistent_returns_404() -> None:
    nonexistent_schedule_assignment_id = 9999

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.delete(
        f"/schedule_assignments/{nonexistent_schedule_assignment_id}/"
    )
    assert response.status_code == 404


# endregion DELETE


# region PATCH
@pytest.mark.django_db
def test_schedule_assignment_patch_correct_data_returns_200() -> None:
    student_1 = insert_dummy_student("student1@gmail.com")
    student_2 = insert_dummy_student("student2@gmail.com")
    assignment = insert_dummy_schedule_assignment(student_1.user)

    data = {"user": student_2.user.id}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.patch(
        f"/schedule_assignments/{assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 200
    assert response.data["user"] == student_2.user.id
    assert response.data["schedule_definition"] == assignment.schedule_definition.id

    # Verify using GET
    response = client.get(f"/schedule_assignments/{assignment.id}/")
    assert response.status_code == 200
    assert response.data["user"] == student_2.user.id
    assert response.data["schedule_definition"] == assignment.schedule_definition.id


@pytest.mark.django_db
def test_schedule_assignment_patch_nonexistent_entry_returns_404() -> None:
    # student_1 = insert_dummy_student("student1@gmail.com")
    student_2 = insert_dummy_student("student2@gmail.com")
    non_existent_assignment_id = 9999
    data = {"user": student_2.user.id}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.patch(
        f"/schedule_assignments/{non_existent_assignment_id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_patch_invalid_field_returns_400() -> None:
    student = insert_dummy_student("student@gmail.com")
    assignment = insert_dummy_schedule_assignment(student.user)
    wrong_user_data = "wrong user formatted data"
    data = {"user": wrong_user_data}

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.patch(
        f"/schedule_assignments/{assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response.status_code == 400


# endregion PATCH


# region GET by date and user
@pytest.mark.django_db
def test_schedule_assignment_get_by_date_and_user_get_existing_returns_200() -> None:
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)
    date = assignment.assigned_date

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )

    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert assignment.id in response_ids
    assert len(response_ids) == 1


@pytest.mark.django_db
def test_schedule_assignment_by_get_date_and_user_get_nonexistent_date_returns_empty_list_and_200():  # noqa: E501
    student = insert_dummy_student()
    date = "2000-01-01"

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )
    response_ids = [data["id"] for data in response.data]

    assert response.status_code == 200
    assert len(response_ids) == 0


@pytest.mark.django_db
def test_schedule_assignment_by_get_date_and_user_get_nonexistent_user_returns_empty_list_and_200():  # noqa: E501
    nonexistent_user_id = 9999
    date = "2000-01-01"

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={nonexistent_user_id}"
    )

    assert response.status_code == 400


# endregion GET by date and user

# endregion Unit testing

# region Authentication testing

# region POST


@pytest.mark.django_db
def test_schedule_assignment_post_allowed_superstudent_admin() -> None:
    dummy_student_1 = insert_dummy_student("student1@gmail.com")
    dummy_student_2 = insert_dummy_student("student2@gmail.com")
    dummy_date = "2000-01-01"
    dummy_definition = insert_dummy_schedule_definition()

    data_1 = {
        "user": dummy_student_1.user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": dummy_date,
    }

    data_2 = {
        "user": dummy_student_2.user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": dummy_date,
    }
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")

    client = APIClient()

    client.force_login(super_student.user)
    response_super_student = client.post(
        "/schedule_assignments/", json.dumps(data_1), content_type="application/json"
    )

    client.force_login(admin.user)
    response_admin = client.post(
        "/schedule_assignments/", json.dumps(data_2), content_type="application/json"
    )

    assert response_super_student.status_code == 201
    assert response_admin.status_code == 201


@pytest.mark.django_db
def test_schedule_assignment_post_not_allowed_anonymous_student_syndicus() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_date = "2000-01-01"
    dummy_definition = insert_dummy_schedule_definition()

    data = {
        "user": dummy_student.user.id,
        "schedule_definition": dummy_definition.id,
        "assigned_date": dummy_date,
    }

    student = insert_dummy_student("super@gmail.com", is_super_student=False)
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    client = APIClient()

    client.logout()
    response_anonymous = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    client.force_login(student.user)
    response_student = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    client.force_login(syndicus.user)
    response_syndicus = client.post(
        "/schedule_assignments/", json.dumps(data), content_type="application/json"
    )

    assert response_anonymous.status_code == 403
    assert response_student.status_code == 403
    assert response_syndicus.status_code == 403


# endregion POST


# region GET item
@pytest.mark.django_db
def test_schedule_assignment_get_allowed_superstudent_admin() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")

    client.force_login(super_student.user)
    response_super_student = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    client.force_login(admin.user)
    response_admin = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_get_not_allowed_anonymous_syndicus() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)

    client = APIClient()
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    client.logout()
    response_anonymous = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    client.force_login(syndicus.user)
    response_syndicus = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    assert response_anonymous.status_code == 403
    assert response_syndicus.status_code == 403


@pytest.mark.django_db
def test_schedule_assignment_get_not_allowed_non_existing_assignment() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    non_existent_assignment = 99999999999999

    client = APIClient()

    client.force_login(dummy_student.user)
    response = client.get(f"/schedule_assignments/{non_existent_assignment}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_schedule_assignment_get_matching_user_allowed_non_matching_user_not_allowed():  # noqa: E501
    """
    A student is allowed to GET a specific schedule_assignment if the user
    requesting the assignment is the same as the user field in the
    assignment.
    request.user.id == schedule_assignment.user.id
    """

    student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(student.user)

    client = APIClient()

    # Test if the matching user is allowed to get the resource
    client.force_login(student.user)
    response_student = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )
    assert response_student.status_code == 200

    # Test if a different, non-matching user, is not allowed to get the resource
    other_student = insert_dummy_student("otherstudent@gmail.com")
    client.force_login(other_student.user)
    response_other = client.get(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )
    assert response_other.status_code == 404


# endregion GET item
# region DELETE
@pytest.mark.django_db
def test_schedule_assignment_delete_allowed_superstudent() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)

    client.force_login(super_student.user)
    response_super_student = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    assert response_super_student.status_code == 204


@pytest.mark.django_db
def test_schedule_assignment_delete_allowed_admin() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)

    client = APIClient()
    admin = insert_dummy_admin()

    client.force_login(admin.user)
    response_admin = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    assert response_admin.status_code == 204


@pytest.mark.django_db
def test_schedule_assignment_delete_not_allowed_with_existing_work_entries() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_work_entry = insert_dummy_schedule_work_entry(dummy_student.user)

    client = APIClient()
    admin = insert_dummy_admin()

    client.force_login(admin.user)
    response_admin = client.delete(
        f"/schedule_assignments/{dummy_work_entry.schedule_assignment.id}/"
    )

    assert response_admin.status_code == 400


@pytest.mark.django_db
def test_schedule_assignment_delete_not_allowed_anonymous_student_syndicus() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)

    client = APIClient()

    student = insert_dummy_student()
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    client.logout()
    response_anonymous = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    client.force_login(student.user)
    response_student = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    client.force_login(syndicus.user)
    response_syndicus = client.delete(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/"
    )

    assert response_anonymous.status_code == 403
    assert response_student.status_code == 403
    assert response_syndicus.status_code == 403


# endregion DELETE
# region PATCH
@pytest.mark.django_db
def test_schedule_assignment_patch_allowed_superstudent_admin() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)
    data: Dict[Any, Any] = {}

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")

    client.force_login(super_student.user)
    response_super_student = client.patch(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    client.force_login(admin.user)
    response_admin = client.patch(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_patch_not_allowed_anonymous_student_syndicus() -> None:
    dummy_student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(dummy_student.user)
    data: Dict[Any, Any] = {}

    client = APIClient()

    student = insert_dummy_student()
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    client.logout()
    response_anonymous = client.patch(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    client.force_login(student.user)
    response_student = client.patch(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    client.force_login(syndicus.user)
    response_syndicus = client.patch(
        f"/schedule_assignments/{dummy_schedule_assignment.id}/",
        json.dumps(data),
        content_type="application/json",
    )

    assert response_anonymous.status_code == 403
    assert response_student.status_code == 403
    assert response_syndicus.status_code == 403


# endregion PATCH


# region GET by date and user
@pytest.mark.django_db
def test_schedule_assignment_get_by_date_and_user_allowed_superstudent_admin() -> None:
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)
    date = assignment.assigned_date

    client = APIClient()
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")

    client.force_login(super_student.user)
    response_super_student = client.get(
        f"/schedule_assignments/?assigned_date{date}&user={student.user.id}"
    )

    client.force_login(admin.user)
    response_admin = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_assignment_get_by_date_and_user_not_allowed_anonymous_syndicus() -> (
    None
):
    student = insert_dummy_student()
    assignment = insert_dummy_schedule_assignment(student.user)
    date = assignment.assigned_date

    client = APIClient()
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    client.logout()
    response_anonymous = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )

    client.force_login(syndicus.user)
    response_syndicus = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )

    assert response_anonymous.status_code == 403
    assert response_syndicus.status_code == 403


@pytest.mark.django_db
def test_schedule_assignment_by_user_and_date_get_matching_user_allowed_non_matching_user_not_allowed():  # noqa: E501
    """
    A student is allowed to GET a specific schedule_assignment if the user
    requesting the assignment is the same as the user field in the
    assignment.
    request.user.id == schedule_assignment.user.id
    """

    student = insert_dummy_student("dummystudent@gmail.com")
    dummy_schedule_assignment = insert_dummy_schedule_assignment(student.user)
    date = dummy_schedule_assignment.assigned_date

    client = APIClient()

    # Test if the matching user is allowed to get the resource
    client.force_login(student.user)
    response_student = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )
    assert response_student.status_code == 200

    # Test if a different, non-matching user, is not allowed to get the resource
    other_student = insert_dummy_student("otherstudent@gmail.com")
    client.force_login(other_student.user)
    response_other = client.get(
        f"/schedule_assignments/?assigned_date={date}&user={student.user.id}"
    )
    assert response_other.status_code == 200 and len(response_other.data) == 0


# endregion GET by date and user

# region Forbidden methods


@pytest.mark.django_db
def test_schedule_assignment_forbidden_methods() -> None:
    """
    The forbidden methods for list are: GET, PUT, PATCH, DELETE
    Anonymous user, syndicus and student gets 403
    Student and admin get 405
    """
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    super_student = insert_dummy_student(
        "superstudent@gmail.com", is_super_student=True
    )
    admin = insert_dummy_admin("admin@gmail.com")
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    client = APIClient()

    # Anonymous user gets 403
    client.logout()
    assert client.get("/schedule_assignments/").status_code == 403
    assert client.put("/schedule_assignments/").status_code == 403
    assert client.patch("/schedule_assignments/").status_code == 403
    assert client.delete("/schedule_assignments/").status_code == 403

    # Syndicus gets 403
    client.force_login(syndicus.user)
    assert client.get("/schedule_assignments/").status_code == 403
    assert client.put("/schedule_assignments/").status_code == 403
    assert client.patch("/schedule_assignments/").status_code == 403
    assert client.delete("/schedule_assignments/").status_code == 403

    # Student gets 403
    client.force_login(student.user)
    assert client.get("/schedule_assignments/").status_code == 200
    assert client.put("/schedule_assignments/").status_code == 403
    assert client.patch("/schedule_assignments/").status_code == 403
    assert client.delete("/schedule_assignments/").status_code == 403

    # Super student gets 405
    client.force_login(super_student.user)
    assert client.get("/schedule_assignments/").status_code == 200
    assert client.put("/schedule_assignments/").status_code == 405
    assert client.patch("/schedule_assignments/").status_code == 405
    assert client.delete("/schedule_assignments/").status_code == 405

    # Admin gets 405
    client.force_login(admin.user)
    assert client.get("/schedule_assignments/").status_code == 200
    assert client.put("/schedule_assignments/").status_code == 405
    assert client.patch("/schedule_assignments/").status_code == 405
    assert client.delete("/schedule_assignments/").status_code == 405


@pytest.mark.django_db
def test_schedule_assignment_by_user_and_date_forbidden_methods() -> None:
    """
    The only method allowed for by_user_and_date is GET, the other methods
    (POST, PUT, PATCH, and DELETE) are forbidden.
    """
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    super_student = insert_dummy_student(
        "superstudent@gmail.com", is_super_student=True
    )
    admin = insert_dummy_admin("admin@gmail.com")
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    client = APIClient()

    url = "/schedule_assignments/?assigned_date=1999-01-01&user=9999"

    # Anonymous user gets 404
    client.logout()
    assert client.post(url).status_code == 403
    assert client.put(url).status_code == 403
    assert client.patch(url).status_code == 403
    assert client.delete(url).status_code == 403

    # Syndicus gets 403
    client.force_login(syndicus.user)
    assert client.post(url).status_code == 403
    assert client.put(url).status_code == 403
    assert client.patch(url).status_code == 403
    assert client.delete(url).status_code == 403

    # Student gets 403
    client.force_login(student.user)
    assert client.post(url).status_code == 403
    assert client.put(url).status_code == 403
    assert client.patch(url).status_code == 403
    assert client.delete(url).status_code == 403

    # Super student gets 405
    client.force_login(super_student.user)
    assert client.post(url).status_code == 400
    assert client.put(url).status_code == 405
    assert client.patch(url).status_code == 405
    assert client.delete(url).status_code == 405

    # Admin gets 405
    client.force_login(admin.user)
    assert client.post(url).status_code == 400
    assert client.put(url).status_code == 405
    assert client.patch(url).status_code == 405
    assert client.delete(url).status_code == 405


# endregion Forbidden methods

# endregion Authentication testing
