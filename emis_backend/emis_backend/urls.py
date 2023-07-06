# Main urls

from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls', namespace='authentication')),
    path('api/', include('social_django.urls', namespace='social')),
    path('api/administrator/', include('administrator.urls', namespace='administrator')),
    path('api/staff/', include('staff.urls', namespace='staff')),
    path('api/teacher/', include('teacher.urls', namespace='teacher')),
    path('api/student/', include('student.urls', namespace='student')),
    path('api/file/', include('file_handler.urls', namespace='file_handler')),
    path('api/email/', include('email_handler.urls', namespace='email_handler')),
    path('api/', include('miscellaneous.urls', namespace='miscellaneous')),
    path('api/core/', include('core.urls', namespace='core')),
    path('api/academy/', include('academy.urls', namespace='academy')),
]

