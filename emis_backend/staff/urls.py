# staff/urls.py

# from django.urls import include, path
# from rest_framework.routers import DefaultRouter
# from .views import StaffViewSet, staff_users_view, get_staff_view, StaffPartialUpdateView

# router = DefaultRouter()
# router.register(r'', StaffViewSet, basename='staff')

# urlpatterns = [
#     path('users/', staff_users_view, name='staff_users_view'),
#     path('profile/', get_staff_view, name='get_staff_view'),
#     path('update-partial/<int:id>/', StaffPartialUpdateView.as_view(), name='staff-partial-update'),
#     path('', include(router.urls)),
# ]


from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, StaffUsersView, StaffPartialUpdate, StaffDeleteView, GetStaffView

router = DefaultRouter()
router.register(r'', StaffViewSet, basename='staff')

urlpatterns = [
    path('users/', StaffUsersView.as_view(), name='staff_users_view'),
    path('profile/', GetStaffView.as_view(), name='get_staff_view'),
    path('update-partial/<int:pk>/', StaffPartialUpdate.as_view(), name='staff-partial-update'),
    path('delete/<int:pk>/', StaffDeleteView.as_view(), name='staff-delete'),
    path('', include(router.urls)),
]


