import pytest
import json

from drtrottoir.buildings_serializer import BuildingSerializer
from drtrottoir.location_groups_serializer import LocationGroupSerializer
from drtrottoir.models import User, Building, LocationGroup
from django.test.client import encode_multipart, RequestFactory
from rest_framework.test import force_authenticate, APIRequestFactory

from drtrottoir.issues_views import IssuesListApiView


@pytest.mark.django_db
def test_issues_list_api_view_post():
    dummy_location_group_data = {
        'name': 'dummy location group name'
    }

    location_group_serializer = LocationGroupSerializer(data=dummy_location_group_data)
    assert location_group_serializer.is_valid()
    location_group_serializer.save()

    dummy_location_group_instance_id = location_group_serializer.data['id']

    dummy_building_data = {
        'address': 'dummy street',
        'guide_pdf_path': 'dummy pdf path',
        'location_group': dummy_location_group_instance_id
    }

    building_serializer = BuildingSerializer(data=dummy_building_data)
    assert building_serializer.is_valid()
    building_serializer.save()

    dummy_building_instance_id = building_serializer.data['id']

    dummy_issue_data = {
        'building_id': dummy_building_instance_id,
        'message': 'dummy message'
    }

    User.objects.create_user(username="test@gmail.com", password="test")

    factory = APIRequestFactory()
    user = User.objects.get(username='test@gmail.com')
    view = IssuesListApiView.as_view()

    # Make an authenticated request to the view...
    request = factory.post('/issues/', json.dumps(dummy_issue_data), content_type="application/json")
    force_authenticate(request, user=user)
    response = view(request)

    assert response.data == {
        'id': 1,
        'resolved': False,
        'message': 'dummy message',
        'building': 1,
        'from_user': 1,
        'approval_user': None
    }
    assert response.status_code == 201
