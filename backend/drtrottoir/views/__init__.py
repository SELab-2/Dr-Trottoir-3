from .building import BuildingListViewSet
from .garbage_collection_schedule import GarbageCollectionScheduleViewSet
from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
from .garbage_type import GarbageTypeViewSet
from .issue import IssueDetailApiView, IssueNotApprovedApiView, IssuesListApiView
from .location_group import LocationGroupViewSet
from .schedule_assignment_views import ScheduleAssignmentViewSet
from .schedule_work_entry_views import ScheduleWorkEntryViewSet

__all__ = [
    "LocationGroupViewSet",
    "BuildingListViewSet",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageCollectionScheduleViewSet",
    "GarbageTypeViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "ScheduleAssignmentViewSet",
    "ScheduleWorkEntryViewSet",
]
