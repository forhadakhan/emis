# teacher/models.py

from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from teacher.models import Designation

#####################################################################
##################### Designation:
#####################   - independent. 
#####################   linked with: create_designations().  
class Designation(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return self.name
#####################################################################




#####################################################################
##################### create_designations:
#####################   - dependent on: Designation.
@receiver(post_migrate)
def create_designations(sender, **kwargs):
    if kwargs.get('app').__name__ == 'academy.models':
        designations_data = [
            'Teaching Assistant',
            'Instructor',
            'Lecturer',
            'Senior Lecturer',
            'Principal Lecturer',
            'Assistant Professor',
            'Associate Professor',
            'Professor',
            'Distinguished Professor',
            'Honorary Professor',
            'Research Associate',
            'Postdoctoral Fellow',
            'Chair/Chairperson',
            'Head of Department',
            'Dean',
            'Emeritus Professor',
            'Visiting Professor',
            'Adjunct Professor',
            'Research Professor',
        ]

        for designation_name in designations_data:
            Designation.objects.get_or_create(name=designation_name)
#####################################################################
