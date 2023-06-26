# file_handler/urls.py 

app_name = 'file_handler'

from django.urls import path
from .views import FileUploadView, FileDeleteView

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('delete/', FileDeleteView.as_view(), name='file-delete'),
]
