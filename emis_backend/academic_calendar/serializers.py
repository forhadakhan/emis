# academic_calendar/serializers.py

from rest_framework.serializers import ModelSerializer
from .models import DefaultCalendarActivity, UserCalendarActivity


class DefaultCalendarActivitySerializer(ModelSerializer):
    class Meta:
        model = DefaultCalendarActivity
        fields = '__all__'



