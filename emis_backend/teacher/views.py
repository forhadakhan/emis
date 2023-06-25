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



class CustomJSONEncoder(serializers.json.DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)



class GetTeacherView(APIView):
    def get(self, request):
        user_id = request.GET.get('reference')
        try:
            teacher = Teacher.objects.get(user_id=user_id)
            user = User.objects.select_related('teacher').values(
                'last_login', 'username', 'first_name', 'last_name',
                'email', 'is_staff', 'is_active', 'date_joined', 'role', 'middle_name', 'id'
            ).get(teacher=teacher)
            user_added_by = teacher.added_by.username
            user_updated_by = ''
            if teacher.updated_by:
                user_updated_by = teacher.updated_by.username

            teacher_data = serializers.serialize('python', [teacher])
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

            combined_data = teacher_data[0]
            combined_data['fields']['added_by'] = user_added_by
            combined_data['fields']['updated_by'] = user_updated_by
            combined_data['fields']['user'] = user_data

            serialized_data = json.dumps(combined_data, cls=CustomJSONEncoder)
            return HttpResponse(serialized_data, content_type='application/json')
        except Teacher.DoesNotExist:
            return JsonResponse({'error': 'Teacher not found'}, status=404)



class TeacherPartialUpdate(generics.UpdateAPIView):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)



class TeacherDeleteView(DestroyModelMixin, GenericAPIView):
    queryset = Teacher.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            user_id = instance.user.id
            user_delete_view = UserDeleteView()
            response = user_delete_view.delete(request, user_id)
            if response.status_code != 204:
                return response
        return self.destroy(request, *args, **kwargs)

