# core/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import Permission
from .models import PermissionGroup


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


