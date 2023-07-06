# authentication/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('administrator', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff'),
    )

    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    email_verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.pk:  # Check if the object is already in the database
            original_email = User.objects.get(pk=self.pk).email
            if self.email != original_email:  # Email field has changed
                self.email_verified = False
        super().save(*args, **kwargs)
