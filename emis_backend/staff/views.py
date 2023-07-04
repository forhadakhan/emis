# staff/views.py

import json
from datetime import date
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework import status, generics, viewsets
from rest_framework.mixins import DestroyModelMixin
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from authentication.permissions import IsAdministrator
from rest_framework.response import Response
from authentication.models import User
from authentication.serializers import UserSerializer
from authentication.views import UserDeleteView
from rest_framework.views import APIView
from .models import Staff
from .serializers import StaffSerializer
from core.models import PermissionGroup
from django.contrib.auth.models import Permission
from django.shortcuts import get_object_or_404



class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def create(self, request, *args, **kwargs):
        staff_data = request.data.copy()
        user_data = json.loads(staff_data.pop('user')[0])
        user_data["role"] = "staff"
        user_data["is_staff"] = True
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        staff_data['user'] = user.id

        serializer = self.get_serializer(data=staff_data)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class StaffUsersView(APIView):
    def get(self, request):
        staff_users = User.objects.filter(role='staff')
        serialized_users = serializers.serialize('json', staff_users, fields=('username', 'first_name', 'last_name', 'email', 'is_active'))
        return HttpResponse(serialized_users, content_type='application/json')


class CustomJSONEncoder(serializers.json.DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()
        return super().default(obj)


class GetStaffView(APIView):
    def get(self, request):
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


class StaffPartialUpdate(generics.UpdateAPIView):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class StaffDeleteView(DestroyModelMixin, GenericAPIView):
    queryset = Staff.objects.all()
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


class StaffAllPermissionsView(APIView):
    def get(self, request):
        username = request.GET.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
                staff = Staff.objects.get(user=user)
                permissions = staff.permissions.values_list('codename', flat=True)
                return JsonResponse({'permissions': list(permissions)})
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found.'}, status=404)
            except Staff.DoesNotExist:
                return JsonResponse({'error': 'Staff not found.'}, status=404)
        else:
            return JsonResponse({'error': 'Missing username parameter.'}, status=400)


class StaffHasPermissionView(APIView):
    def get(self, request):
        username = request.GET.get('username')
        permission_codename = request.GET.get('permission_codename')
        
        if username and permission_codename:
            try:
                user = User.objects.get(username=username)
                staff = Staff.objects.get(user=user)
                has_permission = staff.user.has_perm(permission_codename)
                data = {'has_permission': has_permission}
                return JsonResponse(data)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found.'}, status=404)
            except Staff.DoesNotExist:
                return JsonResponse({'error': 'Staff not found.'}, status=404)
        else:
            return JsonResponse({'error': 'Missing username or permission_codename parameter.'}, status=400)
        

class StaffUpdatePermissionsView(APIView):
    permission_classes = [IsAdministrator]

    def patch(self, request, staff_id):
        try:
            staff = get_object_or_404(Staff, id=staff_id)
        except Staff.DoesNotExist:
            return Response({"success": False, "message": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            group_ids = request.data.get('groups', [])
            permission_ids = request.data.get('permissions', [])

            # Get the permissions based on the provided permission IDs
            permissions = Permission.objects.filter(id__in=permission_ids)

            # Update the permissions of the staff
            staff.permissions.set(permissions)

            # Get the permission groups based on the provided group IDs
            groups = PermissionGroup.objects.filter(id__in=group_ids)

            # Update the permission groups of the staff
            staff.permission_groups.set(groups)

            return Response({"success": True, "message": "Staff groups/permissions updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "message": "Staff groups/permissions update failed", "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


