from django.test import TestCase

# Create your tests here.

# core/views.py 

import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from authentication.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import PermissionGroup
from django.contrib.auth.models import Permission
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse


class TokenDecoder:
    @staticmethod
    def decode_token(authorization_header):
        try:
            auth_type, access_token = authorization_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise ValueError('Invalid Authorization header')

            decoded_token = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
            return decoded_token
        except (ValueError, jwt.exceptions.DecodeError):
            return None
        

class CustomContentTypesView(APIView):
    def get(self, request):
        from django.conf import settings

        custom_apps = getattr(settings, 'CUSTOM_APPS', [])

        content_types = ContentType.objects.filter(app_label__in=custom_apps)

        data = {
            'content_types': [
                {
                    'id': content_type.id,
                    'app_label': content_type.app_label,
                    'model': content_type.model,
                }
                for content_type in content_types
            ]
        }

        return JsonResponse(data)


class ContentTypePermissionsView(APIView):
    def get(self, request):
        content_type_id = request.GET.get('content_type_id')

        if not content_type_id:
            return JsonResponse({'error': 'Content type ID is required'}, status=400)

        try:
            content_type = ContentType.objects.get(id=content_type_id)
        except ContentType.DoesNotExist:
            return JsonResponse({'error': 'Content type not found'}, status=404)

        permissions = Permission.objects.filter(content_type=content_type)

        data = {
            'permissions': [
                {
                    'id': permission.id,
                    'codename': permission.codename,
                    'name': permission.name,
                }
                for permission in permissions
            ]
        }

        return JsonResponse(data)


class PermissionGroupCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        authorization_header = request.headers.get('Authorization')

        # Check if the Authorization header is present
        if not authorization_header:
            return Response({'message': 'Access token missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract the access token from the Authorization header
        try:
            auth_type, access_token = authorization_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise ValueError('Invalid Authorization header')
        except ValueError:
            return Response({'message': 'Invalid Authorization header'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode the access token to retrieve the user ID
        try:
            decoded_token = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
            print(decoded_token)
            user_id = decoded_token['user_id']
        except jwt.exceptions.DecodeError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the request user role   
        try:
            user = User.objects.get(id=user_id)
            user_role = user.role
        except User.DoesNotExist:
            return Response({'message': 'Request user not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if user_role != 'administrator':
            return Response({"success": False, "message": "Only administrators can create permission groups"})

        # Assuming the request contains the necessary data for creating a permission group
        group_name = request.data.get('group_name')
        permission_ids = request.data.get('permissions', [])  # Assuming a list of permission IDs is provided

        try:
            permission_group = PermissionGroup.objects.create(name=group_name)

            # Get the permissions based on the provided permission IDs
            permissions = Permission.objects.filter(id__in=permission_ids)

            # Add the permissions to the permission group
            permission_group.permissions.set(permissions)

            return Response({"success": True, "message": "Permission group created successfully"})
        except Exception as e:
            return Response({"success": False, "message": str(e)})



class PermissionGroupListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        permission_groups = PermissionGroup.objects.all()

        group_data = []
        for group in permission_groups:
            group_data.append({
                'id': group.id,
                'name': group.name,
                'permissions': [permission.codename for permission in group.permissions.all()]
            })

        return Response(group_data)

