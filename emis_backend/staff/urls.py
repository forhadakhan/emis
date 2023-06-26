# staff/urls.py

app_name = 'staff'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, StaffUsersView, StaffPartialUpdate, StaffDeleteView, GetStaffView, StaffAllPermissionsView, StaffHasPermissionView

router = DefaultRouter()
router.register(r'', StaffViewSet, basename='staff')

urlpatterns = [
    path('users/', StaffUsersView.as_view(), name='staff_users_view'),
    path('profile/', GetStaffView.as_view(), name='get_staff_view'),
    path('update-partial/<int:pk>/', StaffPartialUpdate.as_view(), name='staff_partial_update'),
    path('delete/<int:pk>/', StaffDeleteView.as_view(), name='staff_delete'),
    path('permissions/', StaffAllPermissionsView.as_view(), name='staff_permissions'),
    path('has-permission/', StaffHasPermissionView.as_view(), name='staff_has_permission'),
    path('', include(router.urls)),
]


