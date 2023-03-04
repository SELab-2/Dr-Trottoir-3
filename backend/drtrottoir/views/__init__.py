from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)

from .location_group import (
    LocationGroupViewSet,
    LocationGroupDetailApiView,
    LocationGroupListApiView,
)

from .building import (
    BuildingListApiView,
)

__all__ = [
    "LocationGroupViewSet",
    "BuildingListApiView",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "LocationGroupDetailApiView",
    "LocationGroupListApiView",
]
