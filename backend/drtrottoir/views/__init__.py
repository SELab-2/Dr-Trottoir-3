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
    BuildingListApiView,
)

__all__ = [
    "LocationGroupViewSet",
    "BuildingListApiView",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "LocationGroupDetailApiView",
    "LocationGroupListApiView",
]
