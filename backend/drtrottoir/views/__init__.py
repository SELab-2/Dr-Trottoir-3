from .building import BuildingViewSet
from .garbage_collection_schedule import GarbageCollectionScheduleViewSet
from .garbage_collection_schedule_template import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
)
from .garbage_type import GarbageTypeViewSet
from .issue import IssueDetailApiView, IssueNotApprovedApiView, IssuesListApiView
from .issue_image import IssueImageDetailView, IssueImageView
from .location_group import LocationGroupViewSet
from .schedule_assignment_views import ScheduleAssignmentViewSet
from .schedule_definition import ScheduleDefinitionViewSet
from .schedule_work_entry_views import ScheduleWorkEntryViewSet
from .users import UserViewSet

__all__ = [
    "LocationGroupViewSet",
    "BuildingViewSet",
    "GarbageCollectionScheduleTemplateEntryViewSet",
    "GarbageCollectionScheduleTemplateViewSet",
    "GarbageCollectionScheduleViewSet",
    "GarbageTypeViewSet",
    "IssuesListApiView",
    "IssueDetailApiView",
    "IssueNotApprovedApiView",
    "ScheduleAssignmentViewSet",
    "ScheduleWorkEntryViewSet",
    "IssueImageView",
    "IssueImageDetailView",
    "ScheduleDefinitionViewSet",
    "UserViewSet",
]
