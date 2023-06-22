from django.urls import path
from .views import FileUploadView, FileDeleteView

app_name = 'file_handler'

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('delete/', FileDeleteView.as_view(), name='file-delete'),
]
