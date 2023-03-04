from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateApiView,
    GarbageCollectionScheduleTemplateEntryApiView,
)

from .location_group import (
    LocationGroupListApiView,
    LocationGroupDetailApiView,
)

from .building import (
    BuildingListApiView,
)

__all__ = [
    "GarbageCollectionScheduleTemplateApiView",
    "GarbageCollectionScheduleTemplateEntryApiView",
    "LocationGroupListApiView",
    "LocationGroupDetailApiView",
    "BuildingListApiView",
]
