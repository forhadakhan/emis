# student/views.py

import json
from datetime import date
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework import status, generics, viewsets
from rest_framework.mixins import DestroyModelMixin
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from authentication.models import User
from authentication.serializers import UserSerializer
from .models import Student
from .serializers import StudentSerializer
from authentication.views import UserDeleteView
from rest_framework.views import APIView


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, *args, **kwargs):
        student_data = request.data.copy()
        user_data = json.loads(student_data.pop('user')[0])
        user_data["role"] = "student"
        user_data["is_staff"] = False
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        student_data['user'] = user.id

        serializer = self.get_serializer(data=student_data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class StudentUsersView(APIView):
    def get(self, request):
        student_users = User.objects.filter(role='student')
        serialized_users = serializers.serialize('json', student_users, fields=('username', 'first_name', 'last_name', 'email', 'is_active'))
        return HttpResponse(serialized_users, content_type='application/json')



class CustomJSONEncoder(serializers.json.DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)



class GetStudentView(APIView):
    def get(self, request):
        user_id = request.GET.get('reference')
        try:
            student = Student.objects.get(user_id=user_id)
            user = User.objects.select_related('student').values(
                'last_login', 'username', 'first_name', 'last_name',
                'email', 'is_staff', 'is_active', 'date_joined', 'role', 'middle_name', 'id'
            ).get(student=student)
            user_added_by = student.added_by.username
            user_updated_by = ''
            if student.updated_by:
                user_updated_by = student.updated_by.username

            student_data = serializers.serialize('python', [student])
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

            combined_data = student_data[0]
            combined_data['fields']['added_by'] = user_added_by
            combined_data['fields']['updated_by'] = user_updated_by
            combined_data['fields']['user'] = user_data

            serialized_data = json.dumps(combined_data, cls=CustomJSONEncoder)
            return HttpResponse(serialized_data, content_type='application/json')
        except Student.DoesNotExist:
            return JsonResponse({'error': 'Student not found'}, status=404)
