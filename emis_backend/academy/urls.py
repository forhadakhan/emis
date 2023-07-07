# academy/urls.py

app_name = 'academy'

from django.urls import path

from .views import (
    DesignationAPIView,
    TermChoicesAPIView,  
)


urlpatterns = [
    path('designations/', DesignationAPIView.as_view(), name='designations'),
    path('designations/<int:pk>/', DesignationAPIView.as_view(), name='designation-pk'),
    path('term-choices/', TermChoicesAPIView.as_view(), name='term-choices'),  
    path('term-choices/<int:pk>/', TermChoicesAPIView.as_view(), name='term-choice-pk'),  
]
