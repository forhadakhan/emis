# press/urls.py

app_name = 'press'

from django.urls import path
from .views import MediaListCreateView


urlpatterns = [
    path('', MediaListCreateView.as_view(), name='press-list-create'),
    # GET    ----- list:   api/press/
    # POST   --- create:   api/press/
    
]

