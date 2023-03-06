from .building import BuildingListViewSet
from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
from .garbage_type import GarbageTypeViewSet
from .issue import IssueDetailApiView, IssueNotApprovedApiView, IssuesListApiView
from .issue_image import IssueImageDetailView, IssueImageView
from .location_group import LocationGroupViewSet
from .schedule_assignment_views import ScheduleAssignmentViewSet
from .schedule_work_entry_views import ScheduleWorkEntryViewSet

__all__ = [
    "LocationGroupViewSet",
    "BuildingListViewSet",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageTypeViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "ScheduleAssignmentViewSet",
    "ScheduleWorkEntryViewSet",
    "IssueImageView",
    "IssueImageDetailView",
]
