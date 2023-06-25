# academy/models.py

from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver


#####################################################################
##################### Designation:
#####################   - independent. 
class Designation(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Institute:
#####################   - independent. 
class Institute(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField(blank=True)
    about = models.TextField(blank=True)
    history = models.TextField(blank=True)

    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Department:
#####################   - dependent on: Institute. 
class Department(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField()
    about = models.TextField(blank=True)
    history = models.TextField(blank=True)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### TermChoices:
#####################   independent.  
#####################   linked with: create_term_choices().  
class TermChoices(models.Model):
    name = models.CharField(max_length=100)
    start = models.CharField(max_length=24, blank=True)
    end = models.CharField(max_length=24, blank=True)

    def __str__(self):
        return self.name
#####################################################################






#####################################################################
##################### Model:
#####################   - in/dependent 

#####################################################################







#####################################################################
##################### create_term_choices:
#####################   - dependent on:  TermChoices
@receiver(post_migrate)
def create_term_choices(sender, **kwargs):
    if kwargs.get('app').__name__ == 'academy.models':
        term_choices_data = [
            {
                'name': 'Fall',
                'start': 'August',
                'end': 'December'
            },
            {
                'name': 'Autumn',
                'start': 'September',
                'end': 'December'
            },
            {
                'name': 'Spring',
                'start': 'January',
                'end': 'May'
            },
            {
                'name': 'Winter',
                'start': 'January',
                'end': 'April'
            },
            {
                'name': 'Summer',
                'start': 'May',
                'end': 'August'
            },
        ]

        for term_data in term_choices_data:
            TermChoices.objects.get_or_create(**term_data)
#####################################################################




