import pytest
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_student,
    insert_dummy_syndicus,
)

# region Unit testing


# region GET list
@pytest.mark.django_db
def test_location_groups_get_list_empty_returns_empty_list_200():
    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.get("/location_groups/")

    assert len(response.data) == 0
    assert response.status_code == 200


@pytest.mark.django_db
def test_location_groups_get_list_multiple_entries_return_200():
    location_1 = insert_dummy_location_group()
    location_2 = insert_dummy_location_group()

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.get("/location_groups/")

    response_ids = [e["id"] for e in response.data]
    assert sorted([location_1.id, location_2.id]) == sorted(response_ids)
    assert response.status_code == 200


# endregion GET list

# region GET item


@pytest.mark.django_db
def test_location_groups_get_existing_returns_200():
    location = insert_dummy_location_group()

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.get(f"/location_groups/{location.id}/")

    assert response.status_code == 200
    assert response.data["id"] == location.id
    assert response.data["name"] == location.name


@pytest.mark.django_db
def test_location_groups_get_non_existing_returns_404():
    non_existent_location = 9999

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.get(f"/location_groups/{non_existent_location}/")

    assert response.status_code == 404


# endregion GET item

# region POST


@pytest.mark.django_db
def test_location_groups_post_correct_format_returns_201():
    name = "name"
    data = {"name": name}

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.post("/location_groups/", data)

    assert response.status_code == 201
    assert response.data["name"] == name

    expected_fields = ["id", "name"]
    assert sorted(expected_fields) == sorted(list(response.data.keys()))


@pytest.mark.django_db
def test_location_groups_post_incorrect_format_returns_400():
    """
    The maximum allowed name length is 255, so the incorrect
    format is going over that threshold
    """
    name = "name" * 256
    data = {"name": name}

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.post("/location_groups/", data)

    assert response.status_code == 400


@pytest.mark.django_db
def test_location_groups_post_missing_fields_returns_400():
    data = {}

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.post("/location_groups/", data)

    assert response.status_code == 400


# endregion POST

# region DELETE


@pytest.mark.django_db
def test_location_groups_delete_existing_returns_204():
    location = insert_dummy_location_group()

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)

    response = client.delete(f"/location_groups/{location.id}/")
    assert response.status_code == 204

    # Verify that the resource is deleted
    assert client.get(f"/location_groups/{location.id}/").status_code == 404


@pytest.mark.django_db
def test_location_groups_delete_non_existing_returns_404():
    non_existing_location = 9999

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.delete(f"/location_groups/{non_existing_location}/")

    assert response.status_code == 404


# endregion DELETE

# region PATCH


@pytest.mark.django_db
def test_location_groups_correct_data_returns_200():
    location = insert_dummy_location_group()
    new_name = "new name"
    data = {"name": new_name}

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.patch(f"/location_groups/{location.id}/", data)

    assert response.status_code == 200
    assert response.data["id"] == location.id
    assert response.data["name"] == new_name

    expected_fields = ["id", "name"]
    assert sorted(expected_fields) == sorted(list(response.data.keys()))


@pytest.mark.django_db
def test_location_groups_incorrect_data_returns_400():
    location = insert_dummy_location_group()
    new_name = "new name" * 256  # Maximum data length is 255
    data = {"name": new_name}

    admin = insert_dummy_admin()
    client = APIClient()
    client.force_login(admin.user)
    response = client.patch(f"/location_groups/{location.id}/", data)

    assert response.status_code == 400


# endregion PATCH

# endregion Unit testing

# region Authentication testing

# region GET list


@pytest.mark.django_db
def _test_location_groups_get_list(user):
    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.get("/location_groups/")
    return response


@pytest.mark.django_db
def test_location_group_get_list():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_location_groups_get_list(None).status_code == 403

    assert _test_location_groups_get_list(syndicus.user).status_code == 200
    assert _test_location_groups_get_list(student.user).status_code == 200
    assert _test_location_groups_get_list(superstudent.user).status_code == 200
    assert _test_location_groups_get_list(admin.user).status_code == 200


# endregion GET list


# region GET item


@pytest.mark.django_db
def _test_location_groups_get_item(user):
    location = insert_dummy_location_group()

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.get(f"/location_groups/{location.id}/")
    return response


@pytest.mark.django_db
def test_location_group_get_item():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_location_groups_get_item(None).status_code == 403

    assert _test_location_groups_get_item(syndicus.user).status_code == 200
    assert _test_location_groups_get_item(student.user).status_code == 200
    assert _test_location_groups_get_item(superstudent.user).status_code == 200
    assert _test_location_groups_get_item(admin.user).status_code == 200


# endregion GET item


# region POST


@pytest.mark.django_db
def _test_location_groups_post(user):
    data = {"name": "name"}

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.post("/location_groups/", data)
    return response


@pytest.mark.django_db
def test_location_group_post():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_location_groups_post(None).status_code == 403
    assert _test_location_groups_post(syndicus.user).status_code == 403
    assert _test_location_groups_post(student.user).status_code == 403

    assert _test_location_groups_post(superstudent.user).status_code == 201
    assert _test_location_groups_post(admin.user).status_code == 201


# endregion POST


# region DELETE


@pytest.mark.django_db
def _test_location_groups_delete(user):
    location = insert_dummy_location_group()

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.delete(f"/location_groups/{location.id}/")
    return response


@pytest.mark.django_db
def test_location_group_delete():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_location_groups_delete(None).status_code == 403
    assert _test_location_groups_delete(syndicus.user).status_code == 403
    assert _test_location_groups_delete(student.user).status_code == 403

    assert _test_location_groups_delete(superstudent.user).status_code == 204
    assert _test_location_groups_delete(admin.user).status_code == 204


# endregion DELETE


# region PATCH


@pytest.mark.django_db
def _test_location_groups_patch(user):
    location = insert_dummy_location_group()
    data = {"name": "name"}

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.patch(f"/location_groups/{location.id}/", data)
    return response


@pytest.mark.django_db
def test_location_group_patch():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_location_groups_patch(None).status_code == 403
    assert _test_location_groups_patch(syndicus.user).status_code == 403
    assert _test_location_groups_patch(student.user).status_code == 403

    assert _test_location_groups_patch(superstudent.user).status_code == 200
    assert _test_location_groups_patch(admin.user).status_code == 200


# endregion PATCH


@pytest.mark.django_db
def test_location_groups_forbidden_methods():
    """
    The forbidden methods are: PUT
    """
    client = APIClient()

    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student(is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    client.logout()
    assert client.put("/location_groups/").status_code == 403

    client.force_login(student.user)
    assert client.put("/location_groups/").status_code == 403

    client.force_login(syndicus.user)
    assert client.put("/location_groups/").status_code == 403

    client.force_login(superstudent.user)
    assert client.put("/location_groups/").status_code == 405

    client.force_login(admin.user)
    assert client.put("/location_groups/").status_code == 405


# endregion Authentication testing

# region Extra functionality testing


@pytest.mark.django_db
def test_location_group_get_buildings_list():
    location_group_1 = insert_dummy_location_group()
    location_group_2 = insert_dummy_location_group()
    building_1 = insert_dummy_building(lg=location_group_1)
    building_2 = insert_dummy_building(lg=location_group_1)
    building_3 = insert_dummy_building(lg=location_group_2)
    url = f"/location_groups/{location_group_1.id}/buildings/"

    client = APIClient()
    admin = insert_dummy_admin()
    client.force_login(admin.user)
    response = client.get(url)

    response_ids = [e["id"] for e in response.data]

    assert response.status_code == 200
    assert building_1.id in response_ids
    assert building_2.id in response_ids
    assert building_3.id not in response_ids

    # Authentication
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    syndicus = insert_dummy_syndicus()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(student.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200


@pytest.mark.django_db
def test_location_group_get_schedule_definitions_list():
    location_group_1 = insert_dummy_location_group()
    location_group_2 = insert_dummy_location_group()
    sched_definition_1 = insert_dummy_schedule_definition(lg=location_group_1)
    sched_definition_2 = insert_dummy_schedule_definition(lg=location_group_1)
    sched_definition_3 = insert_dummy_schedule_definition(lg=location_group_2)
    url = f"/location_groups/{location_group_1.id}/schedule_definitions/"

    client = APIClient()
    admin = insert_dummy_admin()
    client.force_login(admin.user)
    response = client.get(url)

    response_ids = [e["id"] for e in response.data]

    assert response.status_code == 200
    assert sched_definition_1.id in response_ids
    assert sched_definition_2.id in response_ids
    assert sched_definition_3.id not in response_ids

    # Authentication
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    syndicus = insert_dummy_syndicus()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(student.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200


# endregion Extra functionality testing
