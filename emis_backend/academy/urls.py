# academy/urls.py

app_name = 'academy'

from django.urls import path

from .views import (
    DesignationAPIView,
)


urlpatterns = [
    path('designations/', DesignationAPIView.as_view(), name='designations'),
    path('designations/<int:pk>/', DesignationAPIView.as_view(), name='designation-detail'),
]
