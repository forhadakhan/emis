# teacher/views.py

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
from .models import Teacher
from .serializers import TeacherSerializer
from authentication.views import UserDeleteView
from rest_framework.views import APIView


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def create(self, request, *args, **kwargs):
        teacher_data = request.data.copy()
        user_data = json.loads(teacher_data.pop('user')[0])
        user_data["role"] = "teacher"
        user_data["is_staff"] = True
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        teacher_data['user'] = user.id

        serializer = self.get_serializer(data=teacher_data)
        serializer.is_valid(raise_exception=True)
        Teacher = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TeacherUsersView(APIView):
    def get(self, request):
        teacher_users = User.objects.filter(role='teacher')
        serialized_users = serializers.serialize('json', teacher_users, fields=('username', 'first_name', 'last_name', 'email', 'is_active'))
        return HttpResponse(serialized_users, content_type='application/json')
