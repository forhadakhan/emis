# academic_calendar/views.py

from rest_framework.filters import OrderingFilter
from rest_framework.viewsets import ModelViewSet 
from rest_framework.decorators import action
from rest_framework.response import Response
from authentication.permissions import IsAdministratorOrStaff 
from rest_framework.permissions import IsAuthenticated 
from .models import DefaultCalendarActivity, UserCalendarActivity, Weekend 
from .serializers import DefaultCalendarActivitySerializer, UserCalendarActivitySerializer, WeekendSerializer 



class DefaultCalendarActivityViewSet(ModelViewSet):
    # permission_classes = [IsAdministratorOrStaff]
    queryset = DefaultCalendarActivity.objects.all()
    serializer_class = DefaultCalendarActivitySerializer
    filter_backends = [OrderingFilter]

    def get_queryset(self):
        queryset = self.queryset
        date = self.request.query_params.get('date')  # Filter by date if provided
        year = self.request.query_params.get('year')  # Filter by year if provided
        month = self.request.query_params.get('month')  # Filter by month if provided

        if date:
            queryset = queryset.filter(date=date)
        elif year and month:
            queryset = queryset.filter(date__year=year, date__month=month)
        elif year:
            queryset = queryset.filter(date__year=year)

        return queryset



class UserCalendarActivityViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = UserCalendarActivity.objects.all()
    serializer_class = UserCalendarActivitySerializer
    filter_backends = [OrderingFilter]


    def get_queryset(self):
        queryset = self.queryset
        date = self.request.query_params.get('date')  # Filter by date if provided
        year = self.request.query_params.get('year')  # Filter by year if provided
        month = self.request.query_params.get('month')  # Filter by month if provided

        if date:
            queryset = queryset.filter(date=date)
        elif year and month:
            queryset = queryset.filter(date__year=year, date__month=month)
        elif year:
            queryset = queryset.filter(date__year=year)

        return queryset
    

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



class WeekendViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaff]
    queryset = Weekend.objects.all()
    serializer_class = WeekendSerializer
    filter_backends = [OrderingFilter]

    def get_queryset(self):
        queryset = self.queryset
        status = self.request.query_params.get('status')
        day = self.request.query_params.get('day')

        if status:
            """
            Filter by status if provided.
            status=True means weekends.
            status=False means regular day.
            """
            queryset = queryset.filter(status=status)
        elif day:
            """
            Filter by day name if provided.
            """
            queryset = queryset.filter(day=day)

        return queryset



