import json

import pytest

from drtrottoir.serializers import GarbageTypeSerializer
from drtrottoir.views import GarbageTypesApiView

from rest_framework.test import APIRequestFactory


def insert_dummy_garbage_type() -> int:
    dummy_garbage_type_data = {
        'name': 'garbageType'
    }

    garbage_type_serializer = GarbageTypeSerializer(data=dummy_garbage_type_data)
    assert garbage_type_serializer.is_valid()
    garbage_type_serializer.save()

    return garbage_type_serializer.data['id']


@pytest.mark.django_db
def test_garbage_type_api_view_post():
    dummy_garbage_type_data = {
        'name': 'PMD'
    }

    factory = APIRequestFactory()
    view = GarbageTypesApiView.as_view()

    request = factory.post('/garbage_type/', json.dumps(dummy_garbage_type_data), content_type="application/json")
    response = view(request)

    assert response.status_code == 201


@pytest.mark.django_db
def test_garbage_type_api_view_get():
    dummy_garbage_type_id_1 = insert_dummy_garbage_type()
    dummy_garbage_type_id_2 = insert_dummy_garbage_type()

    factory = APIRequestFactory()
    view = GarbageTypesApiView.as_view()

    request = factory.get('/garbage_type/')
    response = view(request)

    response_data_ids = [e['id'] for e in response.data]

    assert dummy_garbage_type_id_1 in response_data_ids
    assert dummy_garbage_type_id_2 in response_data_ids
    assert response.status_code == 200
