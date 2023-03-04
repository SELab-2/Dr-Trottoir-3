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
from django.urls import path

from drtrottoir.issues_views import IssuesListApiView
from drtrottoir.views.location_groups_views import LocationGroupListApiView, LocationGroupDetailApiView

from drtrottoir.views import (
    GarbageCollectionScheduleTemplateApiView,
    GarbageCollectionScheduleTemplateEntryApiView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "garbage-collection-schedule-template-entries/",
        GarbageCollectionScheduleTemplateEntryApiView.as_view(),
    ),
    path(
        "garbage-collection-schedule-templates/",
        GarbageCollectionScheduleTemplateApiView.as_view(),
    ),
    path("issues/", IssuesListApiView.as_view()),
    path("location_groups/", LocationGroupListApiView.as_view()),
    path("location_groups/<int:location_group_id>", LocationGroupDetailApiView.as_view())
]
