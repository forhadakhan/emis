# academic_calendar/models.py

from django.contrib.auth import get_user_model
from django.db import models


class DefaultCalendarActivity(models.Model):
    """
        This model will contain calendar activity that will be 
        applicable to everyone.
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    status = models.CharField(max_length=20)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.status:
            self.status = 'REGULAR'
        super(DefaultCalendarActivity, self).save(*args, **kwargs)



class UserCalendarActivity(models.Model):
    """
        This model will contain calendar activity that will be 
        applicable to specific user.
    """
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()

    def __str__(self):
        return self.title


