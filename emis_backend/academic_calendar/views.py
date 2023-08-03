# academic_calendar/views.py

from rest_framework.viewsets import ModelViewSet
from .models import DefaultCalendarActivity, UserCalendarActivity
from .serializers import DefaultCalendarActivitySerializer



class DefaultCalendarActivityViewSet(ModelViewSet):
    queryset = DefaultCalendarActivity.objects.all()
    serializer_class = DefaultCalendarActivitySerializer



