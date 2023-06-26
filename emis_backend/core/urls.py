# administrator/urls.py

app_name = 'core'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustomContentTypesView, PermissionGroupCreateView


urlpatterns = [
    path('custom-content-types/', CustomContentTypesView.as_view(), name='custom_content_types_view'),
    path('permission-group-create/', PermissionGroupCreateView.as_view(), name='permission_group_create_view'),
]


