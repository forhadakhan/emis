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


