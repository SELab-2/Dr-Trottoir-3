from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
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
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "LocationGroupDetailApiView",
    "LocationGroupListApiView",
]
