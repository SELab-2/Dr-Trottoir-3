import datetime
import tempfile

import pytest
from PIL import Image
from rest_framework.test import APIClient

from .dummy_data import (
    insert_dummy_admin,
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_issue,
    insert_dummy_location_group,
    insert_dummy_schedule_definition,
    insert_dummy_student,
    insert_dummy_syndicus,
)

# region Unit testing

# GET list


@pytest.mark.django_db
def test_building_get_list_empty_returns_empty_list_200():
    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get("/buildings/")

    assert len(response.data) == 0
    assert response.status_code == 200


@pytest.mark.django_db
def test_buildings_get_list_multiple_entries_return_200():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get("/buildings/")

    response_ids = [e["id"] for e in response.data]
    assert sorted([dummy_building_1.id, dummy_building_2.id]) == sorted(response_ids)
    assert response.status_code == 200


# endregion GET list

# region GET item


@pytest.mark.django_db
def test_building_get_existing_returns_200():
    building = insert_dummy_building()

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(f"/buildings/{building.id}/")

    assert response.status_code == 200
    assert response.data["id"] == building.id
    assert response.data["address"] == building.address
    assert response.data["pdf_guide"] == building.pdf_guide
    assert response.data["location_group"] == building.location_group.id
    assert response.data["is_active"] == building.is_active
    assert response.data["description"] == building.description
    assert response.data["image"] == building.image
    assert response.data["longitude"] == building.longitude
    assert response.data["latitude"] == building.latitude

    expected_fields = [
        "id",
        "address",
        "pdf_guide",
        "location_group",
        "name",
        "is_active",
        "description",
        "image",
        "longitude",
        "latitude",
    ]
    assert sorted(expected_fields) == sorted(list(response.data.keys()))


@pytest.mark.django_db
def test_building_get_non_existent_returns_404():
    non_existent_building_id = 9999

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(f"/buildings/{non_existent_building_id}/")

    assert response.status_code == 404


# endregion GET item

# region POST


@pytest.mark.django_db
def test_buildings_post_correct_format_returns_201():
    dummy_location_group = insert_dummy_location_group()

    tmp_pdf_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_pdf_file.write(b"Hello world!")
    tmp_pdf_file.seek(0)

    image = Image.new("RGB", (100, 100))
    tmp_img_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_img_file)
    tmp_img_file.seek(0)

    name = "name"
    address = "address 1"
    is_active = True
    longitude = 3.7303
    latitude = 51.0500

    data = {
        "name": name,
        "address": address,
        "pdf_guide": tmp_pdf_file,
        "location_group": dummy_location_group.id,
        "is_active": is_active,
        "image": tmp_img_file,
        "longitude": longitude,
        "latitude": latitude,
    }

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.post("/buildings/", data)

    assert response.status_code == 201
    assert response.data["name"] == name
    assert response.data["address"] == address
    assert response.data["is_active"] == is_active
    assert response.data["location_group"] == dummy_location_group.id
    assert response.data["pdf_guide"].endswith(".pdf")
    assert response.data["image"].endswith(".jpg")
    assert float(response.data["longitude"]) == longitude
    assert float(response.data["latitude"]) == latitude


@pytest.mark.django_db
def test_buildings_post_invalid_image_returns_400():
    dummy_location_group = insert_dummy_location_group()

    tmp_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_file.write(b"Hello world!")
    tmp_file.seek(0)

    image = Image.new("RGB", (100, 100))

    tmp_img_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_img_file)
    tmp_img_file.seek(0)
    tmp_img_file.name = "temp_file"

    data = {
        "address": "address 1",
        "is_active": True,
        "location_group": dummy_location_group.id,
        "pdf_guide": tmp_file,
        "image": tmp_img_file,
    }
    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.post("/buildings/", data)

    assert response.status_code == 400


@pytest.mark.django_db
def test_buildings_post_missing_fields_returns_400():
    """The missing fields in this case are address and location_group"""

    tmp_pdf_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_pdf_file.write(b"Hello world!")
    tmp_pdf_file.seek(0)

    image = Image.new("RGB", (100, 100))
    tmp_img_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_img_file)
    tmp_img_file.seek(0)

    name = "name"
    is_active = True
    longitude = 3.7303
    latitude = 51.0500

    data = {
        "name": name,
        "pdf_guide": tmp_pdf_file,
        "is_active": is_active,
        "image": tmp_img_file,
        "longitude": longitude,
        "latitude": latitude,
    }

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.post("/buildings/", data)

    assert response.status_code == 400


# endregion POST

# region DELETE


@pytest.mark.django_db
def test_building_delete_existing_returns_204():
    dummy_building = insert_dummy_building()

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.delete(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 204

    # Verify that the item is deleted
    response = client.get(f"/buildings/{dummy_building.id}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_building_delete_non_existing_returns_404():
    non_existing_id = 9999

    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.delete(f"/buildings/{non_existing_id}/")
    assert response.status_code == 404


# endregion DELETE

# region PATCH


@pytest.mark.django_db
def test_buildings_patch_correct_returns_200():
    """
    In this case we're patching the pdf guide, which also tests for a
    correct file transfer test
    """
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

    assert response.status_code == 200
    assert response.data["name"] == dummy_building.name
    assert response.data["address"] == dummy_building.address
    assert response.data["is_active"] == dummy_building.is_active
    assert response.data["location_group"] == dummy_building.location_group.id
    assert response.data["pdf_guide"].endswith(".pdf")
    assert response.data["image"] == dummy_building.image
    assert response.data["longitude"] == dummy_building.longitude
    assert response.data["latitude"] == dummy_building.latitude


@pytest.mark.django_db
def test_buildings_patch_incorrect_data_returns_400():
    dummy_building = insert_dummy_building()
    non_existent_location_group = 9999

    data = {
        "location_group": non_existent_location_group,
    }
    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.patch(f"/buildings/{dummy_building.id}/", data)

    assert response.status_code == 400


@pytest.mark.django_db
def test_buildings_patch_non_existing_returns_404():
    non_existent_building = 9999

    data = {
        "name": "name",
    }
    student = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(student.user)
    response = client.patch(f"/buildings/{non_existent_building}/", data)

    assert response.status_code == 404


# endregion PATCH

# endregion Unit testing

# region Authentication testing

# region GET list


def _test_buildings_authentication_get_list(user):
    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.get("/buildings/")
    return response


@pytest.mark.django_db
def test_buildings_authentication_get_list():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_buildings_authentication_get_list(None).status_code == 403
    assert _test_buildings_authentication_get_list(syndicus.user).status_code == 403

    assert _test_buildings_authentication_get_list(student.user).status_code == 200
    assert _test_buildings_authentication_get_list(superstudent.user).status_code == 200
    assert _test_buildings_authentication_get_list(admin.user).status_code == 200


# endregion GET list


# region GET item


def _test_buildings_authentication_get_item(user):
    building = insert_dummy_building()

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.get(f"/buildings/{building.id}/")
    return response


@pytest.mark.django_db
def test_buildings_authentication_get_item():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_buildings_authentication_get_item(None).status_code == 403

    assert _test_buildings_authentication_get_item(syndicus.user).status_code == 200
    assert _test_buildings_authentication_get_item(student.user).status_code == 200
    assert _test_buildings_authentication_get_item(superstudent.user).status_code == 200
    assert _test_buildings_authentication_get_item(admin.user).status_code == 200


# endregion GET item

# region DELETE


def _test_buildings_authentication_delete_item(user):
    building = insert_dummy_building()

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.delete(f"/buildings/{building.id}/")
    return response


@pytest.mark.django_db
def test_buildings_authentication_delete_item():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_buildings_authentication_delete_item(None).status_code == 403
    assert _test_buildings_authentication_delete_item(syndicus.user).status_code == 403
    assert _test_buildings_authentication_delete_item(student.user).status_code == 403

    assert (
        _test_buildings_authentication_delete_item(superstudent.user).status_code == 204
    )
    assert _test_buildings_authentication_delete_item(admin.user).status_code == 204


# endregion DELETE


# region PATCH


def _test_buildings_authentication_patch_item(user):
    building = insert_dummy_building()

    client = APIClient()
    if user is not None:
        client.force_login(user)

    response = client.patch(f"/buildings/{building.id}/", {"name": "name"})
    return response


@pytest.mark.django_db
def test_buildings_authentication_patch_item():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_buildings_authentication_patch_item(None).status_code == 403
    assert _test_buildings_authentication_patch_item(syndicus.user).status_code == 403
    assert _test_buildings_authentication_patch_item(student.user).status_code == 403

    assert (
        _test_buildings_authentication_patch_item(superstudent.user).status_code == 200
    )
    assert _test_buildings_authentication_patch_item(admin.user).status_code == 200


# endregion PATCH


# region POST


def _test_buildings_authentication_post_item(user):
    client = APIClient()
    if user is not None:
        client.force_login(user)

    dummy_location_group = insert_dummy_location_group()

    tmp_pdf_file = tempfile.NamedTemporaryFile(suffix=".pdf")
    tmp_pdf_file.write(b"Hello world!")
    tmp_pdf_file.seek(0)

    image = Image.new("RGB", (100, 100))
    tmp_img_file = tempfile.NamedTemporaryFile(suffix=".jpg")
    image.save(tmp_img_file)
    tmp_img_file.seek(0)

    name = "name"
    address = "address 1"
    is_active = True
    longitude = 3.7303
    latitude = 51.0500

    data = {
        "name": name,
        "address": address,
        "pdf_guide": tmp_pdf_file,
        "location_group": dummy_location_group.id,
        "is_active": is_active,
        "image": tmp_img_file,
        "longitude": longitude,
        "latitude": latitude,
    }

    response = client.post("/buildings/", data)
    return response


@pytest.mark.django_db
def test_buildings_authentication_post_item():
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()
    syndicus = insert_dummy_syndicus()

    assert _test_buildings_authentication_post_item(None).status_code == 403
    assert _test_buildings_authentication_post_item(syndicus.user).status_code == 403
    assert _test_buildings_authentication_post_item(student.user).status_code == 403

    assert (
        _test_buildings_authentication_post_item(superstudent.user).status_code == 201
    )
    assert _test_buildings_authentication_post_item(admin.user).status_code == 201


@pytest.mark.django_db
def test_buildings_forbidden_methods():
    """
    The forbidden methods are: PUT, DELETE on list, PATCH on list
    """
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin("admin@gmail.com")
    syndicus = insert_dummy_syndicus()
    client = APIClient()

    # Anonymous user gets 403
    client.logout()
    assert client.put("/buildings/").status_code == 403
    assert client.delete("/buildings/").status_code == 403
    assert client.patch("/buildings/").status_code == 403

    # Syndicus gets 403
    client.force_login(syndicus.user)
    assert client.put("/buildings/").status_code == 403
    assert client.delete("/buildings/").status_code == 403
    assert client.patch("/buildings/").status_code == 403

    # Student gets 403
    client.force_login(student.user)
    assert client.put("/buildings/").status_code == 403
    assert client.delete("/buildings/").status_code == 403
    assert client.patch("/buildings/").status_code == 403

    # Super student gets 405
    client.force_login(superstudent.user)
    assert client.put("/buildings/").status_code == 405
    assert client.delete("/buildings/").status_code == 405
    assert client.patch("/buildings/").status_code == 405

    # Admin gets 405
    client.force_login(admin.user)
    assert client.put("/buildings/").status_code == 405
    assert client.delete("/buildings/").status_code == 405
    assert client.patch("/buildings/").status_code == 405


# endregion POST

# endregion Authentication testing


# region Extra functionality testing
@pytest.mark.django_db
def test_buildings_from_syndicus():
    dummy_building_1 = insert_dummy_building()
    dummy_building_2 = insert_dummy_building()
    # Add a few more buildings
    for _ in range(5):
        insert_dummy_building()

    syndicus = insert_dummy_syndicus(
        email="syndicus@gmail.com", buildings=[dummy_building_1, dummy_building_2]
    )
    url = f"/buildings/users/{syndicus.user_id}/"

    client = APIClient()
    client.force_login(syndicus.user)
    response = client.get(url)

    response_ids = [e["id"] for e in response.data]
    assert response.status_code == 200
    assert sorted([dummy_building_1.id, dummy_building_2.id]) == sorted(response_ids)

    # Authentication
    other_syndicus = insert_dummy_syndicus(email="other@gmail.com")
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(other_syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(student.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


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
    url = f"/buildings/{dummy_building_1.id}/schedule_definitions/"

    superstudent = insert_dummy_student(is_super_student=True)
    client = APIClient()
    client.force_login(superstudent.user)
    response = client.get(url)

    response_ids = [e["id"] for e in response.data]

    assert dummy_schedule_definition_1.id in response_ids
    assert dummy_schedule_definition_2.id in response_ids
    assert dummy_schedule_definition_3.id not in response_ids

    # Authentication
    syndicus = insert_dummy_syndicus()
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(student.user)
    assert client.get(url).status_code == 403

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


@pytest.mark.django_db
def test_building_get_issues_list():
    user = insert_dummy_student(email="student@mail.com").user
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    issue_1 = insert_dummy_issue(user, building_1)
    issue_2 = insert_dummy_issue(user, building_1)
    issue_3 = insert_dummy_issue(user, building_2)

    syndicus = insert_dummy_syndicus(
        buildings=[building_1, building_2], email="syndicus@mail.com"
    )
    url = f"/buildings/{building_1.id}/issues/"

    client = APIClient()
    client.force_login(syndicus.user)
    response = client.get(url)
    response_ids = [e["id"] for e in response.data]

    assert issue_1.id in response_ids
    assert issue_2.id in response_ids
    assert issue_3.id not in response_ids

    # Authentication
    other_syndicus = insert_dummy_syndicus(email="other@gmail.com")
    student = insert_dummy_student("student@gmail.com", is_super_student=False)
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(other_syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(student.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


@pytest.mark.django_db
def test_building_get_schedule_templates_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    template_1 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_2 = insert_dummy_garbage_collection_schedule_template(building_1)
    template_3 = insert_dummy_garbage_collection_schedule_template(building_2)
    url = f"/buildings/{building_1.id}/garbage_collection_schedule_templates/"
    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(url)
    response_ids = [e["id"] for e in response.data]

    assert template_1.id in response_ids
    assert template_2.id in response_ids
    assert template_3.id not in response_ids

    # Authentication
    syndicus = insert_dummy_syndicus()
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


@pytest.mark.django_db
def test_building_get_schedules_list():
    building_1 = insert_dummy_building()
    building_2 = insert_dummy_building()
    schedule_1 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_2 = insert_dummy_garbage_collection_schedule(building_1)
    schedule_3 = insert_dummy_garbage_collection_schedule(building_2)
    url = f"/buildings/{building_1.id}/garbage_collection_schedules/"

    student = insert_dummy_student(is_super_student=False)
    client = APIClient()
    client.force_login(student.user)
    response = client.get(url)
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids

    # Authentication
    syndicus = insert_dummy_syndicus()
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


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

    building = building_1.id
    day = schedule_1.for_day
    url = f"/buildings/{building}/for_day/{day}/garbage_collection_schedules/"

    student = insert_dummy_student(is_super_student=False)

    client = APIClient()
    client.force_login(student.user)
    response = client.get(url)
    response_ids = [e["id"] for e in response.data]

    assert schedule_1.id in response_ids
    assert schedule_2.id in response_ids
    assert schedule_3.id not in response_ids

    # Authentication
    syndicus = insert_dummy_syndicus()
    superstudent = insert_dummy_student("super@gmail.com", is_super_student=True)
    admin = insert_dummy_admin()

    client.logout()
    assert client.get(url).status_code == 403

    client.force_login(syndicus.user)
    assert client.get(url).status_code == 403

    client.force_login(superstudent.user)
    assert client.get(url).status_code == 200

    client.force_login(admin.user)
    assert client.get(url).status_code == 200


# endregion Extra functionality testing
