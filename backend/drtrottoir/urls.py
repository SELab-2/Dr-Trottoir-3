"""drtrottoir URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from drtrottoir import settings
from drtrottoir.views import (
    BuildingListViewSet,
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
    GarbageCollectionScheduleViewSet,
    GarbageTypeViewSet,
    IssueDetailApiView,
    IssueImageDetailView,
    IssueImageView,
    IssueNotApprovedApiView,
    IssuesListApiView,
    LocationGroupViewSet,
    ScheduleAssignmentViewSet,
    ScheduleWorkEntryViewSet,
)

router = DefaultRouter()
router.register(
    r"garbage_collection_schedule_template_entries",
    GarbageCollectionScheduleTemplateEntryViewSet,
)
router.register(
    r"garbage_collection_schedule_templates",
    GarbageCollectionScheduleTemplateViewSet,
)
router.register(r"garbage_type", GarbageTypeViewSet)

router.register(
    r"garbage_collection_schedules",
    GarbageCollectionScheduleViewSet,
)

router.register(
    r"location_groups",
    LocationGroupViewSet,
)

router.register(
    r"buildings",
    BuildingListViewSet,
)


router.register(r"schedule_assignments", ScheduleAssignmentViewSet)
router.register(r"schedule_work_entries", ScheduleWorkEntryViewSet)


urlpatterns = [
    path(settings.BASE_PATH, include(router.urls)),
    path(settings.BASE_PATH + "admin/", admin.site.urls),
    path(settings.BASE_PATH + "issues/", IssuesListApiView.as_view()),
    path(settings.BASE_PATH + "issues/<int:issue_id>/", IssueDetailApiView.as_view()),
    path(settings.BASE_PATH + "issues/not_approved/", IssueNotApprovedApiView.as_view()),
    path(settings.BASE_PATH + "api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(settings.BASE_PATH + "issue_images/", IssueImageView.as_view()),
    path(settings.BASE_PATH + "issue_images/<int:issue_image_id>/", IssueImageDetailView.as_view()),
    # Schedule assignments uses ViewSet, but this particular url has
    # two ids, so it's easier to do it like this
    path(
        settings.BASE_PATH + "schedule_assignments/date/<str:assigned_date>/user/<int:user_id>/",
        ScheduleAssignmentViewSet.retrieve_list_by_date_and_user,
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
