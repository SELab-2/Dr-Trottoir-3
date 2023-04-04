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
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from drtrottoir import settings
from drtrottoir.views import (
    BuildingViewSet,
    GarbageCollectionScheduleTemplateEntryViewSet,
    GarbageCollectionScheduleTemplateViewSet,
    GarbageCollectionScheduleViewSet,
    GarbageTypeViewSet,
    IssueImageDetailView,
    IssueImageView,
    IssueImageViewSet,
    IssueViewSet,
    LocationGroupViewSet,
    ScheduleAssignmentViewSet,
    ScheduleDefinitionViewSet,
    ScheduleWorkEntryViewSet,
    UserViewSet,
)

schema_view = get_schema_view(
    openapi.Info(
        title="Dr. Trottoir Group 3",
        default_version="v1",
        description="",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
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
router.register(r"garbage_types", GarbageTypeViewSet)

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
    BuildingViewSet,
)


router.register(
    r"schedule_assignments", ScheduleAssignmentViewSet, basename="schedule-assignments"
)
router.register(
    r"schedule_work_entries", ScheduleWorkEntryViewSet, basename="schedule-work-entries"
)
router.register(r"schedule_definitions", ScheduleDefinitionViewSet)
router.register(r"users", UserViewSet)
router.register(r"issues", IssueViewSet, basename="issues")
router.register(r"issue_images", IssueImageViewSet, basename="issue-images")


urlpatterns = [
    path(settings.BASE_PATH, include(router.urls)),
    path(settings.BASE_PATH + "admin/", admin.site.urls),
    # path(settings.BASE_PATH + "issues/", IssuesListApiView.as_view()),
    # path(settings.BASE_PATH + "issues/<int:issue_id>/", IssueDetailApiView.as_view()),
    # path(
    #     settings.BASE_PATH + "issues/not_approved/", IssueNotApprovedApiView.as_view()
    # ),
    path(
        settings.BASE_PATH + "api-auth/",
        include("rest_framework.urls", namespace="rest_framework"),
    ),
    # path(settings.BASE_PATH + "issue_images/", IssueImageView.as_view()),
    # path(
    #     settings.BASE_PATH + "issue_images/<int:issue_image_id>/",
    #     IssueImageDetailView.as_view(),
    # ),
    path(
        settings.BASE_PATH + "api-auth/",
        include("rest_framework.urls", namespace="rest_framework"),
    ),
    path(
        settings.BASE_PATH + "auth/token/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        settings.BASE_PATH + "auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
