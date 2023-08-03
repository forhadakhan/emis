# academic_calendar/views.py

from rest_framework.viewsets import ModelViewSet
from .models import DefaultCalendarActivity, UserCalendarActivity
from .serializers import DefaultCalendarActivitySerializer, UserCalendarActivitySerializer



class DefaultCalendarActivityViewSet(ModelViewSet):
    queryset = DefaultCalendarActivity.objects.all()
    serializer_class = DefaultCalendarActivitySerializer



class UserCalendarActivityViewSet(ModelViewSet):
    queryset = UserCalendarActivity.objects.all()
    serializer_class = UserCalendarActivitySerializer


