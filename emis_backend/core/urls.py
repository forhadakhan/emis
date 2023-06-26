# administrator/urls.py

app_name = 'core'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CustomContentTypesView


urlpatterns = [
    path('custom-content-types/', CustomContentTypesView.as_view(), name='custom_content_types_view'),
]


