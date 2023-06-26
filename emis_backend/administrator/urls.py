# administrator/urls.py

app_name = 'administrator'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AdministratorViewSet, AdministratorUsersView, AdministratorPartialUpdate, AdministratorDeleteView, GetAdministratorView

router = DefaultRouter()
router.register(r'', AdministratorViewSet, basename='administrator')

urlpatterns = [
    path('users/', AdministratorUsersView.as_view(), name='administrator_users_view'),
    path('profile/', GetAdministratorView.as_view(), name='get_administrator_view'),
    path('update-partial/<int:pk>/', AdministratorPartialUpdate.as_view(), name='administrator_partial_update'),
    path('delete/<int:pk>/', AdministratorDeleteView.as_view(), name='administrator_delete'),
    path('', include(router.urls)),
]


