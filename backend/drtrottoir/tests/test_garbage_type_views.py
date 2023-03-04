import json
import pytest
import os
import django

from rest_framework.test import APIRequestFactory
from drtrottoir.views import GarbageTypeViewSet
from .dummy_data import insert_dummy_garbage_type


def initialize_django():
    pass


@pytest.mark.django_db
def test_garbage_type_post():
    dummy_garbage_type_data = {
        'name': 'dummy garbage type'
    }

    factory = APIRequestFactory()
    view = GarbageTypeViewSet.as_view({"post": "create"})

    request = factory.post(
        '/garbage_type/',
        json.dumps(dummy_garbage_type_data),
        content_type="application/json"
    )
    response = view(request)

    assert response.data == {"id": 1, "name": "dummy garbage type"}
    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_type_api_view_get():
    dummy_entry_1 = insert_dummy_garbage_type()
    dummy_entry_2 = insert_dummy_garbage_type()

    factory = APIRequestFactory()
    view = GarbageTypeViewSet.as_view({"get": "list"})

    request = factory.get('/garbage_type/')
    response = view(request)

    response_data_ids = [e['id'] for e in response.data]

    assert sorted(response_data_ids) == sorted([dummy_entry_1.id, dummy_entry_2.id])
    assert response.status_code == 200
