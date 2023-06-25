# academy/models.py

from django.db import models


#####################################################################
##################### Designation:
#####################   - independent 
class Designation(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Institute:
#####################   - independent 
class Institute(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField()
    about = models.TextField()
    history = models.TextField()

    def __str__(self):
        return self.name
#####################################################################



#####################################################################
##################### Model:
#####################   - in/dependent 

#####################################################################




