# academic_calendar/views.py

from rest_framework.viewsets import ModelViewSet 
from rest_framework.decorators import action
from rest_framework.response import Response
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

    @action(detail=False, methods=['post'])
    def create_user_activity(self, request):
        """
        Custom action to create a new UserCalendarActivity associated with the authenticated user.

        :param request: The HTTP request object.
        :return: Response with the created UserCalendarActivity data or validation errors.
        """
        user = request.user  # Get the authenticated user from the request
        data = request.data
        data['user'] = user.pk  # Set the 'user' field with the authenticated user's ID
        serializer = UserCalendarActivitySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


