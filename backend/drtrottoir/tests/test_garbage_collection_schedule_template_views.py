import pytest
import json

from drtrottoir.serializers import GarbageCollectionScheduleTemplateEntrySerializer, GarbageCollectionScheduleTemplateSerializer
from drtrottoir.models import GarbageType


def insert_dummy_garbage_type() -> int:
    gt = GarbageType(name="dummy garbage type")
    gt.save()

    return gt.id


@pytest.mark.django_db
def test_garbage_collection_schedule_template_entry_post():
    pass
