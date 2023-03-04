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
from django.urls import include, path, register_converter
from rest_framework.routers import DefaultRouter

from drtrottoir.converters import DateConverter
from drtrottoir.views.schedule_assignment_views import ScheduleAssignmentViewSet
from drtrottoir.views.schedule_work_entry_views import (
    ScheduleWorkEntryApiView,
    ScheduleWorkEntryByCreatorApiView,
    ScheduleWorkEntryByScheduleDefinitionApiView,
    ScheduleWorkEntryListApiView,
)

# Dates follow the format YYYY-MM-DD
register_converter(DateConverter, "date")

router = DefaultRouter()
router.register(r"schedule_assignments", ScheduleAssignmentViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("schedule_assignments/date/<date:assigned_date>/user/<int:user_id>/",
         ScheduleAssignmentViewSet.retrieve_list_by_date_and_user)
]

"""
urlpatterns = [
    path("admin/", admin.site.urls),
    # Schedule assignments
    path("schedule_assignments/", ScheduleAssignmentListApiView.as_view()),
    path(
        "schedule_assignments/date/<date:schedule_assignment_date>/user/<uuid:schedule_assignment_user>/",
        ScheduleAssignmentDateUserApiView.as_view(),
    ),
    path(
        "schedule_assignments/schedule_definitions/<uuid:schedule_definition_id>/",
        ScheduleAssignmentsByScheduleDefinition.as_view(),
    ),
    path(
        "schedule_assignments/<uuid:schedule_assignment_id>/",
        ScheduleAssignmentApiView.as_view(),
    ),
    # Schedule work entries
    path("schedule_work_entries/", ScheduleWorkEntryListApiView.as_view()),
    path(
        "schedule_work_entries/schedule_definitions/<uuid:schedule_definition_id>/",
        ScheduleWorkEntryByScheduleDefinitionApiView.as_view(),
    ),
    path(
        "schedule_work_entries/users/<uuid:user_id>/",
        ScheduleWorkEntryByCreatorApiView.as_view(),
    ),
    path(
        "schedule_work_entries/<uuid:schedule_work_entry_id>/",
        ScheduleWorkEntryApiView.as_view(),
    ),
]
"""
