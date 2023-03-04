from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
from .garbage_type import GarbageTypeViewSet
from .issue import IssueDetailApiView, IssueNotApprovedApiView, IssuesListApiView

from .location_group import (
    LocationGroupViewSet,
    LocationGroupDetailApiView,
    LocationGroupListApiView,
)

from .building import (
    BuildingListViewSet,
    BuildingListApiView,
)

__all__ = [
    "LocationGroupViewSet",
    "BuildingListApiView",
    "BuildingListViewSet",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageTypeViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "LocationGroupDetailApiView",
    "LocationGroupListApiView",
]
