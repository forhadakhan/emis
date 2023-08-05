# press/models.py

from django.db import models
from authentication.models import User


class Media(models.Model):
    CATEGORY_CHOICES = [
        ('notice', 'Notice'),
        ('news', 'News'),
        ('announcement', 'Announcement'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=20, default='other')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
