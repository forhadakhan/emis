# academic_calendar/urls.py

app_name = 'academic_calendar'

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DefaultCalendarActivityViewSet, UserCalendarActivityViewSet

router = DefaultRouter()
router.register(r'calendar-activity', DefaultCalendarActivityViewSet)
router.register(r'user-calendar-activity', UserCalendarActivityViewSet)


urlpatterns = [
    path('', include(router.urls)),
]

