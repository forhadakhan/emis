# administrator/views.py

import json
from datetime import date
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework import status, generics, viewsets
from rest_framework.mixins import DestroyModelMixin
from rest_framework.generics import GenericAPIView
from authentication.permissions import IsAdministrator
from rest_framework.response import Response
from authentication.models import User
from authentication.serializers import UserSerializer
from .models import Administrator
from .serializers import AdministratorSerializer
from authentication.views import UserDeleteView
from rest_framework.views import APIView


class AdministratorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdministrator]
    
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer

    def create(self, request, *args, **kwargs):
        administrator_data = request.data.copy()
        user_data = json.loads(administrator_data.pop('user')[0])
        user_data["role"] = "administrator"
        user_data["is_staff"] = True
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        administrator_data['user'] = user.id

        try:
            serializer = self.get_serializer(data=administrator_data)
            serializer.is_valid(raise_exception=True)
            administrator = serializer.save()
        except Exception as e:
            # Delete the newly created user if creating the teacher fails
            user.delete()

            error_messages = {}
            for field, errors in e.detail.items():
                error_messages[field] = str(errors[0])

            return Response(error_messages, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdministratorUsersView(APIView):
    permission_classes = [IsAdministrator]
    
    def get(self, request):
        administrator_users = User.objects.filter(role='administrator')
        serialized_users = serializers.serialize('json', administrator_users, fields=('username', 'first_name', 'last_name', 'email', 'is_active'))
        return HttpResponse(serialized_users, content_type='application/json')


class CustomJSONEncoder(serializers.json.DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)


class GetAdministratorView(APIView):
    permission_classes = [IsAdministrator]
    
    def get(self, request):
        user_id = request.GET.get('reference')
        try:
            administrator = Administrator.objects.get(user_id=user_id)
            user = User.objects.select_related('administrator').values(
                'last_login', 'username', 'first_name', 'last_name',
                'email', 'is_staff', 'is_active', 'date_joined', 'role', 'middle_name', 'id'
            ).get(administrator=administrator)
            user_added_by = administrator.added_by.username
            user_updated_by = ''
            if administrator.updated_by:
                user_updated_by = administrator.updated_by.username

            administrator_data = serializers.serialize('python', [administrator])
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

            combined_data = administrator_data[0]
            combined_data['fields']['added_by'] = user_added_by
            combined_data['fields']['updated_by'] = user_updated_by
            combined_data['fields']['user'] = user_data

            serialized_data = json.dumps(combined_data, cls=CustomJSONEncoder)
            return HttpResponse(serialized_data, content_type='application/json')
        except Administrator.DoesNotExist:
            return JsonResponse({'error': 'Administrator not found'}, status=404)


class AdministratorPartialUpdate(generics.UpdateAPIView):
    permission_classes = [IsAdministrator]
    
    queryset = Administrator.objects.all()
    serializer_class = AdministratorSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class AdministratorDeleteView(DestroyModelMixin, GenericAPIView):
    permission_classes = [IsAdministrator]
    
    queryset = Administrator.objects.all()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user:
            user_id = instance.user.id
            user_delete_view = UserDeleteView()
            response = user_delete_view.delete(request, user_id)
            if response.status_code != 204:
                return response
        return self.destroy(request, *args, **kwargs)

