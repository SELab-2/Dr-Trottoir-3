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
    IssueViewSet
    # IssuesListApiView,
    # IssueDetailApiView,
    # IssueBuildingApiView,
    # IssueNotApprovedApiView
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

router.register(
    r"issues",
    IssueViewSet,
)

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    # path("issues/", IssuesListApiView.as_view()),
    # path("issues/<int:issue_id>/", IssueDetailApiView.as_view()),
    # path("issues/buildings/<int:building_id>/", IssueBuildingApiView.as_view()),
    # path("issues/not_approved/", IssueNotApprovedApiView.as_view())
]
