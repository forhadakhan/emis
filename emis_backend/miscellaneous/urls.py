# miscellaneous/urls.py 

app_name = 'miscellaneous'

from django.urls import path
from .views import ContactMessageListView, ContactMessagePartialUpdateView, ContactMessageDeleteView, ContactView


urlpatterns = [
    path('contact-messages/', ContactMessageListView.as_view(), name='contact-message-list'),
    path('contact-message-update/<int:id>/', ContactMessagePartialUpdateView.as_view(), name='contact-message-update'),
    path('contact-message-delete/<int:id>/', ContactMessageDeleteView.as_view(), name='contact-message-delete'),
    path('contact/', ContactView.as_view(), name='contact'),
]

