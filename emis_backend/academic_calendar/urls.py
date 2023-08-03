# academic_calendar/urls.py

app_name = 'academic_calendar'

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DefaultCalendarActivityViewSet, UserCalendarActivityViewSet, WeekendViewSet

router = DefaultRouter()

router.register(r'academic-activity', DefaultCalendarActivityViewSet)
"""
List view ____________________: .../academic-activity/
Detail view __________________: .../academic-activity/<pk>/
Filter by date - list view ___: .../academic-activity/?date=YYYY-MM-DD
Filter by year - list view ___: .../academic-activity/?year=YYYY
Filter by month - list view __: .../academic-activity/?year=2023&month=8
"""

router.register(r'user-activity', UserCalendarActivityViewSet)
router.register(r'weekends', WeekendViewSet)



urlpatterns = [
    path('', include(router.urls)),
]

