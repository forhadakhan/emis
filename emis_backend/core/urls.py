# core/urls.py

app_name = 'core'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustomContentTypesView, ContentTypePermissionsView, PermissionGroupCreateView, PermissionGroupListView, GroupUpdateView, GroupDeleteView


urlpatterns = [
    path('custom-content-types/', CustomContentTypesView.as_view(), name='custom_content_types_view'),
    path('content-type-permissions/', ContentTypePermissionsView.as_view(), name='content_type_permissions_view'),
    path('permission-group-create/', PermissionGroupCreateView.as_view(), name='permission_group_create_view'),
    path('permission-group-list/', PermissionGroupListView.as_view(), name='permission_group_list_view'),
    path('permission-group-delete/<int:group_id>/', GroupDeleteView.as_view(), name='permission_group_delete'),
    path('permission-group-update/<int:group_id>/', GroupUpdateView.as_view(), name='permission_group_update'),
]


