# file_handler/models.py

from django.db import models


class File(models.Model):
    # file = models.FileField(upload_to='files/') # it stores locally & i don't need it
    google_drive_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
