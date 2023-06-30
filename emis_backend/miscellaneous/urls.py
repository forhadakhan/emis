# miscellaneous/urls.py 

app_name = 'miscellaneous'

from django.urls import path
from .views import ContactMessageListView, ContactMessagePartialUpdateView, ContactView


urlpatterns = [
    path('contact-messages/', ContactMessageListView.as_view(), name='contact-message-list'),
    path('contact-update/<int:id>/', ContactMessagePartialUpdateView.as_view(), name='contact-message-update'),
    path('contact/', ContactView.as_view(), name='contact'),
]

