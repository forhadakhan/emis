# staff/views.py 

import json
import jwt
from rest_framework import viewsets
from .models import Staff
from .serializers import StaffSerializer
from authentication.serializers import UserSerializer
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse
from rest_framework import status, generics
from authentication.models import User
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
from datetime import date
from rest_framework.mixins import DestroyModelMixin
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from authentication.views import UserDeleteView



class StaffViewSet(viewsets.ModelViewSet):

    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def create(self, request, *args, **kwargs):
        staff_data = request.data.copy()
        print(staff_data)
        user_data = json.loads(staff_data.pop('user')[0])
        user_data["role"] = "staff"
        user_data["is_staff"] = True
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        staff_data['user'] = user.id  # Assign the user ID to the 'user' field of staff data

        # if staff_data['photo'] == "null":
        #     # Remove the 'photo' field if it is null
        #     staff_data.pop('photo')

        serializer = self.get_serializer(data=staff_data)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



def staff_users_view(request):
    staff_users = User.objects.filter(role='staff')
    serialized_users = serializers.serialize('json', staff_users, fields=('username', 'first_name', 'last_name', 'email'))
    return HttpResponse(serialized_users, content_type='application/json')





class CustomJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)


def get_staff_view(request):
    user_id = request.GET.get('reference')
    try:
        staff = Staff.objects.get(user_id=user_id)
        user = User.objects.select_related('staff').values(
            'last_login', 'username', 'first_name', 'last_name',
            'email', 'is_staff', 'is_active', 'date_joined', 'role', 'middle_name', 'id'
        ).get(staff=staff)
        user_added_by = staff.added_by.username
        user_updated_by = ''
        if staff.updated_by: 
            user_updated_by = staff.updated_by.username

        staff_data = serializers.serialize('python', [staff])
        user_data = {
            'username': user['username'],
            'first_name': user['first_name'],
            'middle_name': user['middle_name'],
            'last_name': user['last_name'],
            'email': user['email'],
            'role': user['role'],
            'is_staff': user['is_staff'],
            'is_active': user['is_active'],
            'date_joined': user['date_joined'],
            'last_login': user['last_login'],
            'id': user['id'],
        }

        combined_data = staff_data[0]
        combined_data['fields']['added_by'] = user_added_by
        combined_data['fields']['updated_by'] = user_updated_by
        combined_data['fields']['user'] = user_data

        serialized_data = json.dumps(combined_data, cls=CustomJSONEncoder)
        return HttpResponse(serialized_data, content_type='application/json')
    except Staff.DoesNotExist:
        return JsonResponse({'error': 'Staff not found'}, status=404)



class StaffPartialUpdateView(generics.UpdateAPIView):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    lookup_field = 'id'  # determines the Staff instance to be updated

    def patch(self, request, *args, **kwargs):
        # Retrieve the staff instance to be updated
        instance = self.get_object()

        # Update the staff instance with the request data
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)



class StaffDeleteView(DestroyModelMixin, GenericAPIView):
    queryset = Staff.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        # Delete associated user
        if instance.user:
            user_id = instance.user.id
            user_delete_view = UserDeleteView()
            response = user_delete_view.delete(request, user_id)
            if response.status_code != 204:
                # Handle error if user deletion fails
                return response
        return self.destroy(request, *args, **kwargs)
