from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
from .garbage_type import GarbageTypeViewSet
from .issue import IssueDetailApiView, IssueNotApprovedApiView, IssuesListApiView

from .location_group import (
    LocationGroupViewSet,
)

from .building import (
    BuildingListViewSet,
)

__all__ = [
    "LocationGroupViewSet",
    "BuildingListViewSet",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageTypeViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
]
