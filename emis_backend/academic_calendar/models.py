# academic_calendar/models.py

from django.contrib.auth import get_user_model
from django.db import models


class DefaultCalendarActivity(models.Model):
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


