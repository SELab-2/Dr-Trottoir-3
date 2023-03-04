import pytest
import json

from drtrottoir.models import User
from rest_framework.test import force_authenticate, APIRequestFactory

from drtrottoir.views.issues_views import IssuesListApiView

from .dummy_data import insert_dummy_building, insert_dummy_issue


# def insert_dummy_building() -> int:
#     dummy_location_group_data = {
#         'name': 'dummy location group name'
#     }
#
#     location_group_serializer = LocationGroupSerializer(data=dummy_location_group_data)
#     assert location_group_serializer.is_valid()
#     location_group_serializer.save()
#
#     dummy_location_group_instance_id = location_group_serializer.data['id']
#
#     dummy_building_data = {
#         'address': 'dummy street',
#         'guide_pdf_path': 'dummy pdf path',
#         'location_group': dummy_location_group_instance_id
#     }
#
#     building_serializer = BuildingSerializer(data=dummy_building_data)
#     assert building_serializer.is_valid()
#     building_serializer.save()
#
#     return building_serializer.data['id']


# def insert_dummy_issue(dummy_user_id: int) -> int:
#     dummy_building_id = insert_dummy_building()
#
#     dummy_issue_data = {
#         'building': dummy_building_id,
#         'message': 'dummy issue message',
#         'from_user': dummy_user_id
#     }
#
#     issue_serializer = IssueSerializer(data=dummy_issue_data)
#     assert issue_serializer.is_valid()
#     issue_serializer.save()
#
#     return issue_serializer.data['id']


@pytest.mark.django_db
def test_issues_list_api_view_post():
    dummy_building = insert_dummy_building()

    dummy_issue_data = {
        'building_id': dummy_building.id,
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


@pytest.mark.django_db
def test_issues_list_api_view_get():
    dummy_user = User.objects.create_user(username="test@gmail.com", password="test")

    dummy_issue_id_1 = insert_dummy_issue(dummy_user).id
    dummy_issue_id_2 = insert_dummy_issue(dummy_user).id
    non_existing_issue_id = dummy_issue_id_1 + dummy_issue_id_2

    factory = APIRequestFactory()
    view = IssuesListApiView.as_view()

    request = factory.get(f'/issues/')
    response = view(request)

    response_data_ids = [e['id'] for e in response.data]

    assert dummy_issue_id_1 in response_data_ids
    assert dummy_issue_id_2 in response_data_ids
    assert non_existing_issue_id not in response_data_ids
    assert response.status_code == 200
