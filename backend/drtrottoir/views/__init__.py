from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateApiView,
    GarbageCollectionScheduleTemplateEntryApiView,
)

from .location_groups_views import (
    LocationGroupListApiView,
    LocationGroupDetailApiView,
)

__all__ = [
    "GarbageCollectionScheduleTemplateApiView",
    "GarbageCollectionScheduleTemplateEntryApiView",
    "LocationGroupListApiView",
    "LocationGroupDetailApiView",
]
