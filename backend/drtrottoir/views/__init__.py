from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)

from .garbage_collection_schedule import GarbageCollectionScheduleViewSet

__all__ = [
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageCollectionScheduleViewSet",
]
