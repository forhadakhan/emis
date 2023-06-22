# administrator/models.py  

from django.db import models
from authentication.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Administrator(models.Model):
    GENDER_CHOICES = (
        ('U', 'Undefined'),
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    )
    gender = models.CharField(default='U', choices=GENDER_CHOICES, max_length=1)
    permanent_address = models.TextField(blank=True, null=True)
    present_address = models.TextField(blank=True, null=True)
    nid = models.CharField(default=None, max_length=20, unique=True)
    photo_id = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    father_name = models.CharField(max_length=255, blank=True, null=True)
    mother_name = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, related_name='administrator_updated_by', on_delete=models.SET_NULL, blank=True, null=True)
    added_by = models.ForeignKey(User, related_name='administrator_added_by', on_delete=models.SET_NULL, blank=True, null=True)
    history = models.JSONField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    
