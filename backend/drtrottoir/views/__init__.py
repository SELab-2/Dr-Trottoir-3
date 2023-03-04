from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateApiView,
    GarbageCollectionScheduleTemplateEntryApiView,
)

from .garbage_type import GarbageTypesApiView

__all__ = [
    "GarbageCollectionScheduleTemplateApiView",
    "GarbageCollectionScheduleTemplateEntryApiView",
    "GarbageTypesApiView"
]
