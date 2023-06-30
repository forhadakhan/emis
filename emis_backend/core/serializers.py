# core/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import Permission
from .models import PermissionGroup


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

# Not used
class PermissionGroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = PermissionGroup
        fields = '__all__'

    def create(self, validated_data):
        permissions_data = validated_data.pop('permissions')
        group = PermissionGroup.objects.create(**validated_data)
        for permission_data in permissions_data:
            permission = Permission.objects.get(id=permission_data['id'])
            group.permissions.add(permission)
        return group

    def update(self, instance, validated_data):
        permissions_data = validated_data.pop('permissions')
        instance.name = validated_data.get('name', instance.name)
        instance.permissions.clear()
        for permission_data in permissions_data:
            permission = Permission.objects.get(id=permission_data.get('id'))
            instance.permissions.add(permission)
        instance.save()
        return instance


