# academic_calendar/urls.py

app_name = 'academic_calendar'

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DefaultCalendarActivityAPIView, UserCalendarActivityAPIView, WeekendAPIView

urlpatterns = [
    
    path('academic-activity/<int:pk>/', DefaultCalendarActivityAPIView.as_view(), name='academic-calendar-activity-detail'),
    path('academic-activity/', DefaultCalendarActivityAPIView.as_view(), name='academic-calendar-activity-list'),
    # List view ____________________: .../academic-activity/
    # Detail view __________________: .../academic-activity/<pk>/
    # Delete view __________________: .../academic-activity/<pk>/
    # Update (put/patch) view ______: .../academic-activity/<pk>/
    # Filter by date - list view ___: .../academic-activity/?date=YYYY-MM-DD
    # Filter by year - list view ___: .../academic-activity/?year=YYYY
    # Filter by month - list view __: .../academic-activity/?year=2023&month=8
    
    path('user-activity/<int:pk>/', UserCalendarActivityAPIView.as_view(), name='user-calendar-activity-detail'),
    path('user-activity/', UserCalendarActivityAPIView.as_view(), name='user-calendar-activity-list'),
    # List view ____________________: .../user-activity/
    # Detail view __________________: .../user-activity/<pk>/
    # Delete view __________________: .../user-activity/<pk>/
    # Update (put/patch) view ______: .../user-activity/<pk>/
    # Filter by date - list view ___: .../user-activity/?date=YYYY-MM-DD
    # Filter by year - list view ___: .../user-activity/?year=YYYY
    # Filter by month - list view __: .../user-activity/?year=2023&month=8
    
    path('weekends/<int:pk>/', WeekendAPIView.as_view(), name='weekend-detail'),
    path('weekends/', WeekendAPIView.as_view(), name='weekend-list'),
    # List view: .../weekends/
    # Detail view: .../weekends/<pk>/
    # Delete view: .../weekends/<pk>/
    # Update (put/patch) view: .../weekends/<pk>/
    # Filter by weekends only: .../weekends/?status=True or .../weekends/?status=1
    # Filter by regular days: .../weekends/?status=False or .../weekends/?status=0
    # Filter by day name: .../weekends/?day=Monday
    
]

