# press/urls.py

app_name = 'press'

from django.urls import path
from .views import MediaListCreateView, MediaRetrieveUpdateDeleteView


urlpatterns = [
    path('', MediaListCreateView.as_view(), name='press-list-create'),
    # GET    ----- list:   api/press/
    # POST   --- create:   api/press/
    
    path('<int:pk>/', MediaRetrieveUpdateDeleteView.as_view(), name='press-retrieve-update-delete'),
    # GET    - retrieve:   api/press/<int:pk>/
    # PUT    --- update:   api/press/<int:pk>/
    # DELETE --- update:   api/press/<int:pk>/
    
]

