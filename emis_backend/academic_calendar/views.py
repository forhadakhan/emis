# academic_calendar/views.py

from rest_framework.viewsets import ModelViewSet 
from authentication.permissions import IsAdministratorOrStaff 
from rest_framework.permissions import IsAuthenticated 
from .models import DefaultCalendarActivity, UserCalendarActivity
from .serializers import DefaultCalendarActivitySerializer, UserCalendarActivitySerializer



class DefaultCalendarActivityViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaff]
    queryset = DefaultCalendarActivity.objects.all()
    serializer_class = DefaultCalendarActivitySerializer



class UserCalendarActivityViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = UserCalendarActivity.objects.all()
    serializer_class = UserCalendarActivitySerializer


