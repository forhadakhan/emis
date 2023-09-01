# administrator/models.py  

from django.db import models
from authentication.models import User 
from django.db.models.signals import post_migrate
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
    designation = models.CharField(max_length=99, blank=True, null=True)
    


#####################################################################
##################### create_dafault_admin:
#####################   - dependent on: Administrator, User.

###     This will create a 'default-admin'. 
###     You must disable this admin after you create a real admin 

@receiver(post_migrate)
def create_dafault_admin(sender, **kwargs):
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'administrator': 
        user_data = {
            'username': 'default-admin',
            'first_name': 'Default',
            'last_name': 'Admin',
            'email': 'defaultadmin@emis.test',
            'role': 'administrator',
            'email_verified': True,
        }
        user = User(**user_data)
        user.set_password('Pass-default-admin')
        user.save()
        
        admin_data = {
            'user': user,
            'nid': '01234567890123',
        }
        admin = Administrator(**admin_data)
        admin.save()
#####################################################################

