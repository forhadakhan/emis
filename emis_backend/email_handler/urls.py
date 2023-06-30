# email_handler/urls.py

app_name = 'email_handler'

from django.urls import include, path
from .views import EmailVerificationView, EmailVerificationConfirmView, ResendEmailVerificationView, PasswordResetView, PublicMessageReplyEmailView


urlpatterns = [
    path('verification/', EmailVerificationView.as_view(), name='email_verification'),
    path('resend-verification/', ResendEmailVerificationView.as_view(), name='resend_email_verification'),
    path('verification/confirm/<str:uidb64>/<str:token>/', EmailVerificationConfirmView.as_view(), name='email_verification_confirm'),
    path('reset-password/', PasswordResetView.as_view(), name='reset_password_email'),
    path('public-message-reply/', PublicMessageReplyEmailView.as_view(), name='public_message_reply_email'),
]



