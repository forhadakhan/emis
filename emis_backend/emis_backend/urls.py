
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/', include('social_django.urls', namespace='social')),
    path('api/administrator/', include('administrator.urls')),
    path('api/staff/', include('staff.urls')),
    path('api/file/', include('file_handler.urls')),
]

