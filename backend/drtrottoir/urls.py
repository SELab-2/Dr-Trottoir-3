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
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from drtrottoir.views import (
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
    IssueDetailApiView,
    IssueNotApprovedApiView,
    IssuesListApiView,
)

# Dates follow the format YYYY-MM-DD
register_converter(DateConverter, "date")

router = DefaultRouter()
router.register(
    r"garbage_collection_schedule_template_entries",
    GarbageCollectionScheduleTemplateEntryViewSet,
)
router.register(
    r"garbage_collection_schedule_templates",
    GarbageCollectionScheduleTemplateViewSet,
)

router.register(r"schedule_assignments", ScheduleAssignmentViewSet)
router.register(r"schedule_work_entries", ScheduleWorkEntryViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path(
        "schedule_assignments/date/<date:assigned_date>/user/<int:user_id>/",
        ScheduleAssignmentViewSet.retrieve_list_by_date_and_user,
    ),
]
