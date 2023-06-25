# email_handler/urls.py

from django.urls import include, path
from .views import EmailVerificationView, EmailVerificationConfirmView, ResendEmailVerificationView, PasswordResetView


urlpatterns = [
    path('verification/', EmailVerificationView.as_view(), name='email_verification'),
    path('resend-verification/', ResendEmailVerificationView.as_view(), name='resend_email_verification'),
    path('verification/confirm/<str:uidb64>/<str:token>/', EmailVerificationConfirmView.as_view(), name='email_verification_confirm'),
    path('reset-password/', PasswordResetView.as_view(), name='reset_password_email'),
]



