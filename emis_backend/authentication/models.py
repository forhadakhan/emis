# authentication/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    ROLE_CHOICES = (
        ('administrator', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff'),
    )

    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    
