# academic_calendar/views.py

from authentication.permissions import IsAdministratorOrStaff 
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated 
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DefaultCalendarActivity, UserCalendarActivity, Weekend 
from .serializers import DefaultCalendarActivitySerializer, UserCalendarActivitySerializer, WeekendSerializer 



class DefaultCalendarActivityAPIView(APIView):

    def get(self, request, pk=None):
        permission_classes = [IsAuthenticated]
        if pk is not None:
            # Retrieve a specific DefaultCalendarActivity object by primary key
            try:
                activity = DefaultCalendarActivity.objects.get(pk=pk)
            except DefaultCalendarActivity.DoesNotExist:
                return Response({'error': 'Activity not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = DefaultCalendarActivitySerializer(activity)
            return Response(serializer.data)
        else:
            # Retrieve a list of DefaultCalendarActivity objects
            queryset = DefaultCalendarActivity.objects.all()
            date = request.query_params.get('date')  # Filter by date if provided
            year = request.query_params.get('year')  # Filter by year if provided
            month = request.query_params.get('month')  # Filter by month if provided

            if date is not None:
                # Filter queryset by date
                queryset = queryset.filter(date=date)
            elif year is not None and month is not None:
                # Filter queryset by year and month
                queryset = queryset.filter(date__year=year, date__month=month)
            elif year is not None:
                # Filter queryset by year
                queryset = queryset.filter(date__year=year)

            serializer = DefaultCalendarActivitySerializer(queryset, many=True)
            return Response(serializer.data)

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        # Create a new DefaultCalendarActivity object
        serializer = DefaultCalendarActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        # Update a DefaultCalendarActivity object by its primary key
        try:
            activity = DefaultCalendarActivity.objects.get(pk=pk)
        except DefaultCalendarActivity.DoesNotExist:
            return Response({'error': 'Calendar activity not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DefaultCalendarActivitySerializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        # Partially update a DefaultCalendarActivity object by its primary key
        try:
            activity = DefaultCalendarActivity.objects.get(pk=pk)
        except DefaultCalendarActivity.DoesNotExist:
            return Response({'error': 'Calendar activity not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DefaultCalendarActivitySerializer(activity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        # Delete a DefaultCalendarActivity object by its primary key
        try:
            activity = DefaultCalendarActivity.objects.get(pk=pk)
        except DefaultCalendarActivity.DoesNotExist:
            return Response({'error': 'Calendar activity not found.'}, status=status.HTTP_404_NOT_FOUND)

        activity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class UserCalendarActivityAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve all UserCalendarActivity objects
        queryset = UserCalendarActivity.objects.all()
        date = self.request.query_params.get('date')  # Filter by date if provided
        year = self.request.query_params.get('year')  # Filter by year if provided
        month = self.request.query_params.get('month')  # Filter by month if provided

        if date is not None:
            # Filter queryset by date
            queryset = queryset.filter(date=date)
        elif year is not None and month is not None:
            # Filter queryset by year and month
            queryset = queryset.filter(date__year=year, date__month=month)
        elif year is not None:
            # Filter queryset by year
            queryset = queryset.filter(date__year=year)

        return queryset

    def get(self, request, pk=None):
        if pk is not None:
            # Retrieve a specific UserCalendarActivity object by primary key
            try:
                activity = UserCalendarActivity.objects.get(pk=pk)
            except UserCalendarActivity.DoesNotExist:
                return Response({'error': 'Activity not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = UserCalendarActivitySerializer(activity)
            return Response(serializer.data)
        else:
            # Retrieve a list of UserCalendarActivity objects
            queryset = self.get_queryset()
            serializer = UserCalendarActivitySerializer(queryset, many=True)
            return Response(serializer.data)

    def post(self, request):
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

    def put(self, request, pk):
        """
        Update a UserCalendarActivity object by its primary key (pk).

        :param request: The HTTP request object.
        :param pk: The primary key of the UserCalendarActivity object to update.
        :return: Response with the updated UserCalendarActivity data or validation errors.
        """
        user = request.user  # Get the authenticated user from the request
        try:
            activity = UserCalendarActivity.objects.get(pk=pk, user=user)
        except UserCalendarActivity.DoesNotExist:
            return Response({'error': 'User calendar activity not found.'}, status=404)

        data = request.data
        serializer = UserCalendarActivitySerializer(activity, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def patch(self, request, pk):
        """
        Partially update a UserCalendarActivity object by its primary key (pk).

        :param request: The HTTP request object.
        :param pk: The primary key of the UserCalendarActivity object to update.
        :return: Response with the updated UserCalendarActivity data or validation errors.
        """
        user = request.user  # Get the authenticated user from the request
        try:
            activity = UserCalendarActivity.objects.get(pk=pk, user=user)
        except UserCalendarActivity.DoesNotExist:
            return Response({'error': 'User calendar activity not found.'}, status=404)

        data = request.data
        serializer = UserCalendarActivitySerializer(activity, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        """
        Delete a UserCalendarActivity object by its primary key (pk).

        :param request: The HTTP request object.
        :param pk: The primary key of the UserCalendarActivity object to delete.
        :return: Response with success message or error message.
        """
        user = request.user  # Get the authenticated user from the request
        try:
            activity = UserCalendarActivity.objects.get(pk=pk, user=user)
        except UserCalendarActivity.DoesNotExist:
            return Response({'error': 'UserCalendarActivity not found.'}, status=404)

        activity.delete()
        return Response({'message': 'User calendar activity deleted successfully.'})



class WeekendAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk is not None:
            # Retrieve a specific Weekend object by primary key
            try:
                weekend = Weekend.objects.get(pk=pk)
            except Weekend.DoesNotExist:
                return Response({'error': 'Weekend not found.'}, status=status.HTTP_404_NOT_FOUND)
            serializer = WeekendSerializer(weekend)
            return Response(serializer.data)

        else:
            # Filter by status or day name if provided
            status_param = request.query_params.get('status')
            day_param = request.query_params.get('day')

            if status_param is not None:
                weekends = Weekend.objects.filter(status=status_param)
            elif day_param is not None:
                weekends = Weekend.objects.filter(day=day_param)
            else:
                # Retrieve all weekends if no filters are provided
                weekends = Weekend.objects.all()

            serializer = WeekendSerializer(weekends, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = WeekendSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            weekend = Weekend.objects.get(pk=pk)
        except Weekend.DoesNotExist:
            return Response({'error': 'Weekend/Day not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeekendSerializer(weekend, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            weekend = Weekend.objects.get(pk=pk)
        except Weekend.DoesNotExist:
            return Response({'error': 'Weekend/Day not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WeekendSerializer(weekend, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            weekend = Weekend.objects.get(pk=pk)
        except Weekend.DoesNotExist:
            return Response({'error': 'Weekend/Day not found.'}, status=status.HTTP_404_NOT_FOUND)

        weekend.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



