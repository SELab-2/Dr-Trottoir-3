import json

import pytest
from rest_framework.test import APIRequestFactory, force_authenticate

from drtrottoir.models import User
from drtrottoir.views import GarbageCollectionScheduleTemplateApiView

from .dummy_data import insert_dummy_building


@pytest.mark.django_db
def test_garbage_collection_schedule_template_post():
    building = insert_dummy_building()

    data = {"name": "dummy schedule", "building": building.id}

    User.objects.create_user(username="test@gmail.com", password="test")
    user = User.objects.get(username="test@gmail.com")

    factory = APIRequestFactory()
    view = GarbageCollectionScheduleTemplateApiView.as_view()

    request = factory.post(
        "/garbage-collection-schedule-templates/",
        json.dumps(data),
        content_type="application/json",
    )
    force_authenticate(request, user=user)
    response = view(request)

    assert response.data == {"id": 1, "name": "dummy schedule", "building": building.id}
    assert response.status_code == 201
