# core/models.py

from django.db import models
from django.contrib.auth.models import Permission

class PermissionGroup(models.Model):
    name = models.CharField(max_length=255)
    permissions = models.ManyToManyField(Permission, related_name='permission_groups')

    def __str__(self):
        return self.name

