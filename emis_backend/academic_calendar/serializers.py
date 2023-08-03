# academic_calendar/serializers.py

from rest_framework.serializers import ModelSerializer
from .models import DefaultCalendarActivity, UserCalendarActivity, Weekend


class DefaultCalendarActivitySerializer(ModelSerializer):
    class Meta:
        model = DefaultCalendarActivity
        fields = '__all__'



class UserCalendarActivitySerializer(ModelSerializer):
    class Meta:
        model = UserCalendarActivity
        fields = '__all__'



class WeekendSerializer(ModelSerializer):
    class Meta:
        model = Weekend
        fields = '__all__'


