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
Delete view __________________: .../academic-activity/<pk>/
Update (put/patch) view ______: .../academic-activity/<pk>/
Filter by date - list view ___: .../academic-activity/?date=YYYY-MM-DD
Filter by year - list view ___: .../academic-activity/?year=YYYY
Filter by month - list view __: .../academic-activity/?year=2023&month=8
"""

router.register(r'user-activity', UserCalendarActivityViewSet)
"""
List view ____________________: .../user-activity/
Detail view __________________: .../user-activity/<pk>/
Delete view __________________: .../user-activity/<pk>/
Update (put/patch) view ______: .../user-activity/<pk>/
Filter by date - list view ___: .../user-activity/?date=YYYY-MM-DD
Filter by year - list view ___: .../user-activity/?year=YYYY
Filter by month - list view __: .../user-activity/?year=2023&month=8
"""

router.register(r'weekends', WeekendViewSet)
"""
List view ____________________: .../weekends/
Detail view __________________: .../weekends/<pk>/
Delete view __________________: .../weekends/<pk>/
Update (put/patch) view ______: .../weekends/<pk>/
Filter by weekends only ______: .../weekends/?status=True
Filter by weekends only ______: .../weekends/?status=1
Filter by regular days _______: .../weekends/?status=False
Filter by regular days _______: .../weekends/?status=0
Filter by day name ___________: .../weekends/?day=Monday
"""



urlpatterns = [
    path('', include(router.urls)),
]

