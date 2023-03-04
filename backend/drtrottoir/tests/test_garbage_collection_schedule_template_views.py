import json

import pytest
from rest_framework.test import APIRequestFactory, force_authenticate

from drtrottoir.models import User
from drtrottoir.views import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)

from .dummy_data import (
    insert_dummy_building,
    insert_dummy_garbage_collection_schedule_template,
    insert_dummy_garbage_collection_schedule_template_entry,
    insert_dummy_garbage_type,
)


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post():
    building = insert_dummy_building()

    data = {"name": "dummy schedule", "building": building.id}

    user = User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    view = GarbageCollectionScheduleTemplateViewSet.as_view({"post": "create"})

    request = factory.post(
        "/garbage-collection-schedule-templates/",
        json.dumps(data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request)

    assert response.data == {"id": 1, "name": "dummy schedule", "building": building.id}
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_get():
    template_1 = insert_dummy_garbage_collection_schedule_template()
    template_2 = insert_dummy_garbage_collection_schedule_template()

    factory = APIRequestFactory()
    view = GarbageCollectionScheduleTemplateViewSet.as_view({"get": "list"})

    request = factory.get("/garbage-collection-schedule-templates/")
    response = view(request)

    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([template_1.id, template_2.id])


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post():
    template = insert_dummy_garbage_collection_schedule_template()
    garbage_type = insert_dummy_garbage_type()

    data = {
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }

    user = User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    view = GarbageCollectionScheduleTemplateEntryViewSet.as_view(
        {"get": "list", "post": "create"}
    )

    request = factory.post(
        "/garbage_collection_schedule_template_entries/",
        json.dumps(data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request)

    assert response.data == {
        "id": 1,
        "day": 4,
        "garbage_type": garbage_type.id,
        "garbage_collection_schedule_template": template.id,
    }
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_get():
    entry_1 = insert_dummy_garbage_collection_schedule_template_entry()
    entry_2 = insert_dummy_garbage_collection_schedule_template_entry()

    factory = APIRequestFactory()
    view = GarbageCollectionScheduleTemplateEntryViewSet.as_view({"get": "list"})

    request = factory.get("/garbage_collection_schedule_template_entries/")
    response = view(request)

    response_ids = [e["id"] for e in response.data]

    assert sorted(response_ids) == sorted([entry_1.id, entry_2.id])
