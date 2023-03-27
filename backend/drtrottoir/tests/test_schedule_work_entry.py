import tempfile
from typing import Union

import pytest
from PIL import Image
from rest_framework.test import APIClient

from drtrottoir.models import User
from drtrottoir.tests.dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_schedule_assignment,
    insert_dummy_schedule_definition,
    insert_dummy_schedule_work_entry,
    insert_dummy_student,
    insert_dummy_syndicus,
    insert_dummy_user,
)
from drtrottoir.tests.util import date_equals

# For POST unit and authentication tests, see region POST at the bottom

# TODO POST should also only work if the creation_timestamp is TODAY
#  as of right now that's not implemented yet

# region Unit tests


# region GET list
@pytest.mark.django_db
def test_schedule_work_entry_get_list_empty_returns_empty_list_200() -> None:
    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)

    client.force_login(super_student.user)
    response = client.get("/schedule_work_entries/")

    assert response.status_code == 200
    assert len(response.data["results"]) == 0


@pytest.mark.django_db
def test_schedule_work_entry_get_list_multiple_entries_return_200() -> None:
    student = insert_dummy_student("dummy@student.com")
    work_entry_1 = insert_dummy_schedule_work_entry(student.user)
    work_entry_2 = insert_dummy_schedule_work_entry(student.user)
    work_entry_3 = insert_dummy_schedule_work_entry(student.user)
    work_entry_ids = [work_entry_1.id, work_entry_2.id, work_entry_3.id]
    work_entry_nonexistent_id = sum(work_entry_ids) + 3

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)

    client.force_login(super_student.user)
    response = client.get("/schedule_work_entries/")
    response_ids = [data["id"] for data in response.data["results"]]

    assert response.status_code == 200
    assert sorted(work_entry_ids) == sorted(response_ids)
    assert work_entry_nonexistent_id not in response_ids


# endregion GET list

# region GET


@pytest.mark.django_db
def test_schedule_work_entry_get_existing_returns_200() -> None:
    user = insert_dummy_user("user@gmail.com")
    work_entry = insert_dummy_schedule_work_entry(user)

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_work_entries/{work_entry.id}/")

    assert response.status_code == 200
    assert response.data["creator"] == work_entry.creator.id
    assert response.data["building"] == work_entry.building.id
    assert response.data["schedule_assignment"] == work_entry.schedule_assignment.id
    assert date_equals(
        response.data["creation_timestamp"], str(work_entry.creation_timestamp)
    )
    assert response.data["id"] == work_entry.id


@pytest.mark.django_db
def test_schedule_work_entry_get_non_existing_returns_404() -> None:
    non_exiting_work_entry_id = 9999

    client = APIClient()
    super_student = insert_dummy_student(is_super_student=True)
    client.force_login(super_student.user)

    response = client.get(f"/schedule_work_entries/{non_exiting_work_entry_id}/")
    assert response.status_code == 404


# endregion GET

# region GET by user


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_existing_returns_200() -> None:
    """
    Also tests to make sure we don't have the data of other users
    """
    student = insert_dummy_student("student@gmail.com")
    work_entry_1 = insert_dummy_schedule_work_entry(student.user)
    work_entry_2 = insert_dummy_schedule_work_entry(student.user)
    work_entry_ids = [work_entry_1.id, work_entry_2.id]
    other_student = insert_dummy_student("other@gmail.com")
    other_work_entry = insert_dummy_schedule_work_entry(other_student.user)

    client = APIClient()
    super_student = insert_dummy_student(
        "superstudent@gmail.com", is_super_student=True
    )
    client.force_login(super_student.user)

    response = client.get(f"/schedule_work_entries/?creator={student.user.id}")
    response_ids = [data["id"] for data in response.data["results"]]

    assert response.status_code == 200
    assert sorted(response_ids) == sorted(work_entry_ids)
    assert other_work_entry not in response_ids


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_empty_returns_empty_list_and_200() -> None:
    """
    Also tests to make sure we don't have the data of other users
    """
    student = insert_dummy_student("student@gmail.com")
    client = APIClient()
    super_student = insert_dummy_student(
        "superstudent@gmail.com", is_super_student=True
    )
    client.force_login(super_student.user)

    response = client.get(f"/schedule_work_entries/?creator={student.user.id}")
    response_ids = [data["id"] for data in response.data["results"]]

    assert response.status_code == 200
    assert len(response_ids) == 0


# endregion GET by user

# endregion Unit tests

# region Authentication tests

# region GET list


@pytest.mark.django_db
def test_schedule_work_entry_get_list_allowed_superstudent_admin() -> None:
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")
    client = APIClient()

    client.force_login(super_student.user)
    response_super_student = client.get("/schedule_work_entries/")

    client.force_login(admin.user)
    response_admin = client.get("/schedule_work_entries/")

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_work_entry_get_list_not_allowed_anonymous_student_syndicus() -> None:
    student = insert_dummy_student("super@gmail.com", is_super_student=False)
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    client = APIClient()

    client.logout()
    response_anonymous = client.get("/schedule_work_entries/")

    client.force_login(student.user)
    response_student = client.get("/schedule_work_entries/")

    client.force_login(syndicus.user)
    response_syndicus = client.get("/schedule_work_entries/")

    assert response_anonymous.status_code == 403
    assert response_student.status_code == 200
    assert response_syndicus.status_code == 403


# endregion GET list

# region GET item


@pytest.mark.django_db
def test_schedule_work_entry_get_allowed_superstudent_admin() -> None:
    work_entry = insert_dummy_schedule_work_entry(insert_dummy_user("entry@gmail.com"))
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")
    client = APIClient()

    client.force_login(super_student.user)
    response_super_student = client.get(f"/schedule_work_entries/{work_entry.id}/")

    client.force_login(admin.user)
    response_admin = client.get(f"/schedule_work_entries/{work_entry.id}/")

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_work_entry_get_not_allowed_anonymous_syndicus() -> None:
    work_entry = insert_dummy_schedule_work_entry(insert_dummy_user("entry@gmail.com"))
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    client = APIClient()

    client.logout()
    response_anonymous = client.get(f"/schedule_work_entries/{work_entry.id}/")

    client.force_login(syndicus.user)
    response_syndicus = client.get(f"/schedule_work_entries/{work_entry.id}/")

    assert response_anonymous.status_code == 403
    assert response_syndicus.status_code == 403


@pytest.mark.django_db
def test_schedule_work_entry_get_matching_user_allowed_non_matching_user_not_allowed():  # noqa: E501
    """
    A student is allowed to access a schedule work entry by id if the request user is
    the same as the creator field in the schedule work entry:
    request.user.id == schedule_work_entry.creator.id
    """
    student = insert_dummy_student("student@gmail.com")
    work_entry = insert_dummy_schedule_work_entry(student.user)
    other_student = insert_dummy_student("other@gmail.com")
    client = APIClient()

    client.force_login(student.user)
    response_matching_user = client.get(f"/schedule_work_entries/{work_entry.id}/")

    client.force_login(other_student.user)
    response_other = client.get(f"/schedule_work_entries/{work_entry.id}/")

    assert response_matching_user.status_code == 200
    assert response_other.status_code == 404


# endregion GET item


# region GET by user
@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_allowed_superstudent_admin() -> None:
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")
    client = APIClient()

    client.force_login(super_student.user)
    response_super_student = client.get("/schedule_work_entries/?creator=1")

    client.force_login(admin.user)
    response_admin = client.get("/schedule_work_entries/?creator=1")

    assert response_super_student.status_code == 200
    assert response_admin.status_code == 200


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_not_allowed_anonymous_syndicus() -> None:
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    client = APIClient()

    client.logout()
    response_anonymous = client.get("/schedule_work_entries/?creator=1")

    client.force_login(syndicus.user)
    response_syndicus = client.get("/schedule_work_entries/?creator=1")

    assert response_anonymous.status_code == 403
    assert response_syndicus.status_code == 403


@pytest.mark.django_db
def test_schedule_work_entry_get_non_existent_permissions() -> None:
    student = insert_dummy_student("student@gmail.com")
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))
    non_existent_entry_id = 99999999

    client = APIClient()

    # Anonymous
    client.logout()
    response_anonymous = client.get(f"/schedule_work_entries/{non_existent_entry_id}/")
    # Student
    client.force_login(student.user)
    response_student = client.get(f"/schedule_work_entries/{non_existent_entry_id}/")
    # Super student
    client.force_login(super_student.user)
    response_super = client.get(f"/schedule_work_entries/{non_existent_entry_id}/")
    # Admin
    client.force_login(admin.user)
    response_admin = client.get(f"/schedule_work_entries/{non_existent_entry_id}/")
    # Syndicus
    client.force_login(syndicus.user)
    response_syndicus = client.get(f"/schedule_work_entries/{non_existent_entry_id}/")

    assert response_anonymous.status_code == 403
    assert response_student.status_code == 404
    assert response_syndicus.status_code == 403

    assert response_super.status_code == 404
    assert response_admin.status_code == 404


@pytest.mark.django_db
def test_schedule_work_entry_get_by_user_matching_user_allowed_non_matching_user_not_allowed():  # noqa: E501
    """
    A student is allowed to access a schedule work entry by user if that student's
    user id is the same as the one in the url
    """
    student = insert_dummy_student("student@gmail.com")
    other_student = insert_dummy_student("other@gmail.com")
    client = APIClient()

    client.force_login(student.user)
    response_matching_user = client.get(
        f"/schedule_work_entries/?creator={student.user.id}"
    )

    client.force_login(other_student.user)
    response_other = client.get(f"/schedule_work_entries/?creator={student.user.id}")

    assert response_matching_user.status_code == 200
    assert (
        response_other.status_code == 200 and len(response_other.data["results"]) == 0
    )


# endregion GET by user

# region Forbidden methods


@pytest.mark.django_db
def test_schedule_work_entry_forbidden_methods() -> None:
    """
    The forbidden methods for list are: PUT, PATCH, DELETE
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
    assert client.put("/schedule_work_entries/").status_code == 403
    assert client.patch("/schedule_work_entries/").status_code == 403
    assert client.delete("/schedule_work_entries/").status_code == 403

    # Syndicus gets 403
    client.force_login(syndicus.user)
    assert client.put("/schedule_work_entries/").status_code == 403
    assert client.patch("/schedule_work_entries/").status_code == 403
    assert client.delete("/schedule_work_entries/").status_code == 403

    # Student gets 403
    client.force_login(student.user)
    assert client.put("/schedule_work_entries/").status_code == 405
    assert client.patch("/schedule_work_entries/").status_code == 405
    assert client.delete("/schedule_work_entries/").status_code == 405

    # Super student gets 405
    client.force_login(super_student.user)
    assert client.put("/schedule_work_entries/").status_code == 405
    assert client.patch("/schedule_work_entries/").status_code == 405
    assert client.delete("/schedule_work_entries/").status_code == 405

    # Admin gets 405
    client.force_login(admin.user)
    assert client.put("/schedule_work_entries/").status_code == 405
    assert client.patch("/schedule_work_entries/").status_code == 405
    assert client.delete("/schedule_work_entries/").status_code == 405


# endregion Forbidden methods

# endregion Authentication tests


# region POST tests


"""
A schedule work entry posts has several requirements for it to succeed:
- Only a student (or super student) is allowed to post it
- The creator field must be the samer user as the person making the request
- The building

Because of the complexity of the POST request, I've added these in a separate section
"""


# region Unit tests


def _create_dummy_image(name: str):
    image = Image.new("RGB", (100, 100))
    tmp_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_file)
    tmp_file.seek(0)
    tmp_file.name = name
    return tmp_file


@pytest.mark.django_db
def test_schedule_work_entry_post_correct_format_returns_201() -> None:
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    creation_timestamp = "2222-02-02 22:22"
    image = _create_dummy_image("image.jpg")
    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": creation_timestamp,
        "image": image,
    }

    client = APIClient()
    client.force_login(creator.user)
    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 201
    assert response.data["id"] > 0
    assert response.data["creator"] == creator.user.id
    assert response.data["building"] == building.id
    assert response.data["schedule_assignment"] == schedule_assignment.id
    assert date_equals(response.data["creation_timestamp"], creation_timestamp)
    assert response.data["image"].endswith(".jpg")


@pytest.mark.django_db
def test_schedule_work_entry_post_incorrect_field_returns_400() -> None:
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    image = _create_dummy_image("image.jpg")
    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": "this is a wrong field",
        "image": image,
    }

    client = APIClient()
    client.force_login(creator.user)
    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_work_entry_post_incorrect_image_extension_returns_400() -> None:
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    creation_timestamp = "2222-02-02 22:22"
    image = _create_dummy_image("image")  # Explicitly does not end with .jpg
    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": creation_timestamp,
        "image": image,
    }

    client = APIClient()
    client.force_login(creator.user)
    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_work_entry_post_wrong_creator_returns_400() -> None:
    """
    POST requires that the creator field is the same as the request user.
    This tests verifies that a 400 is returned if this is not the case.
    """
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    creation_timestamp = "2222-02-02 22:22"
    image = _create_dummy_image("image.jpg")
    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": creation_timestamp,
        "image": image,
    }

    client = APIClient()
    other_student = insert_dummy_student("other@gmail.com")
    client.force_login(other_student.user)

    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_schedule_work_entry_post_building_not_matching_schedule_assignment_returns_400():  # noqa: E501
    """
    POST requires that the creator is in at least one schedule assignment containing
    the schedule definition.
    """
    creator = insert_dummy_student()
    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[])
    creation_timestamp = "2222-02-02 22:22"
    image = _create_dummy_image("image.jpg")
    schedule_assignment = insert_dummy_schedule_assignment(
        creator.user, schedule_definition
    )

    data = {
        "creator": creator.user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": creation_timestamp,
        "image": image,
    }

    client = APIClient()
    client.force_login(creator.user)

    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )

    assert response.status_code == 400


# endregion Unit tests

# region Authentication tests


def _test_schedule_work_entry_post_correct_information_give_user(
    user: Union[User, None]
):
    client = APIClient()
    if user is None:
        user = insert_dummy_user()
        client.logout()
    else:
        client.force_login(user)

    building = insert_dummy_building()
    schedule_definition = insert_dummy_schedule_definition(buildings=[building])
    creation_timestamp = "2222-02-02 22:22"
    image = _create_dummy_image("image.jpg")
    schedule_assignment = insert_dummy_schedule_assignment(user, schedule_definition)

    data = {
        "creator": user.id,
        "building": building.id,
        "schedule_assignment": schedule_assignment.id,
        "creation_timestamp": creation_timestamp,
        "image": image,
    }

    response = client.post(
        "/schedule_work_entries/",
        data,
        format="multipart",
    )
    return response


@pytest.mark.django_db
def test_schedule_work_entry_post_allowed_student_superstudent_admin() -> None:
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    super_student = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")

    response_student = _test_schedule_work_entry_post_correct_information_give_user(
        student.user
    )
    response_super_student = (
        _test_schedule_work_entry_post_correct_information_give_user(super_student.user)
    )
    response_admin = _test_schedule_work_entry_post_correct_information_give_user(
        admin.user
    )

    assert response_student.status_code == 201
    assert response_super_student.status_code == 201
    assert response_admin.status_code == 201


@pytest.mark.django_db
def test_schedule_work_entry_post_not_allowed_anonymous_syndicus() -> None:
    syndicus = insert_dummy_syndicus(insert_dummy_user("syndicus@gmail.com"))

    response_anonymous = _test_schedule_work_entry_post_correct_information_give_user(
        None
    )

    response_syndicus = _test_schedule_work_entry_post_correct_information_give_user(
        syndicus.user
    )

    assert response_anonymous.status_code == 403
    assert response_syndicus.status_code == 403


# endregion Authentication tests

# endregion POST tests
