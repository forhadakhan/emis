# academic_calendar/urls.py

app_name = 'academic_calendar'

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DefaultCalendarActivityViewSet, UserCalendarActivityViewSet, WeekendViewSet

router = DefaultRouter()
router.register(r'academic-activity', DefaultCalendarActivityViewSet)
router.register(r'user-activity', UserCalendarActivityViewSet)
router.register(r'weekends', WeekendViewSet)


urlpatterns = [
    path('', include(router.urls)),
]

