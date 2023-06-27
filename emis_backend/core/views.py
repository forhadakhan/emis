# core/views.py 

from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.models import PermissionGroup
from django.contrib.auth.models import Permission
from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse


class PermissionGroupCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != 'administrator':
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
