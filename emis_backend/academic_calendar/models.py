# academic_calendar/models.py

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver 


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


class Weekend(models.Model):
    """
        This model will contain weekends (day names and status).
        Weekend: status=True 
        Regular Day: status=False 
    """
    DAY_CHOICES = [
        ('Sunday', 'Sunday'),
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    ]

    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.day


 


#####################################################################
##################### populate_weekend_table:
#####################   - dependent on: Weekend.
@receiver(post_migrate)
def populate_weekend_table(sender, **kwargs):
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'academic_calendar':

        weekend_data = [
            ('Sunday', False),
            ('Monday', False),
            ('Tuesday', False),
            ('Wednesday', False),
            ('Thursday', False),
            ('Friday', True),
            ('Saturday', True),
        ]

        for day, status in weekend_data:
            Weekend.objects.get_or_create(day=day, status=status)
#####################################################################

