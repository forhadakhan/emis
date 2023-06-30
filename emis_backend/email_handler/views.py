# email_handler/views.py

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from authentication.models import User
from django.http import HttpResponse
from urllib.parse import quote
from django.shortcuts import get_object_or_404
from django.views import View
from django.utils.crypto import get_random_string
from django.conf import settings
from rest_framework.permissions import IsAuthenticated



class EmailVerificationView(APIView):
    def post(self, request):
        user = request.user        
        if user.is_authenticated and not user.email_verified:
            current_site = get_current_site(request)
            subject = 'EMIS: Verify your email'
            uid = quote(urlsafe_base64_encode(force_bytes(user.pk)))  # URL encode the uid
            token = default_token_generator.make_token(user)
            domain = "http://localhost:8000"
            href = f"{domain}/api/email/verification/confirm/{uid}/{token}/"  
            html_message = render_to_string('email_templates/email_verification.html', {
                'user': user,
                'href': href,
            })
            from_email = settings.EMAIL_HOST_USER
            recipients = [user.email]

            msg = EmailMessage(subject, html_message, from_email, recipients)
            msg.content_subtype = 'html'  # Set the content subtype to 'html'
            msg.send()
            return Response({'message': 'Email verification sent'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)



class EmailVerificationConfirmView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        
        if user is not None and default_token_generator.check_token(user, token):
            user.email_verified = True
            user.save()

            # Render the success HTML template
            success_html = render_to_string('email_templates/email_verification_success.html')
            return HttpResponse(success_html, content_type='text/html')
        else:
            # Render the failure HTML template
            failure_html = render_to_string('email_templates/email_verification_failure.html')
            return HttpResponse(failure_html, content_type='text/html', status=status.HTTP_400_BAD_REQUEST)



class ResendEmailVerificationView(APIView):
    def post(self, request):
        username = request.data.get('username')

        try:
            user = User.objects.get(username=username)
            if not user.email_verified:
                current_site = get_current_site(request)
                subject = 'EMIS: Verify your email'
                uid = quote(urlsafe_base64_encode(force_bytes(user.pk)))  # URL encode the uid
                token = default_token_generator.make_token(user)
                domain = "http://localhost:8000"
                href = f"{domain}/api/email/verification/confirm/{uid}/{token}/"  
                message = render_to_string('email_templates/email_verification.html', {
                    'user': user,
                    'href': href,
                })
                email = EmailMessage(subject, message, to=[user.email])
                email.content_subtype = 'html'
                email.send()

                # Generate the email hint
                email_parts = user.email.split('@')
                username_hint = email_parts[0][:2] + '...' + email_parts[0][-1]
                domain_hint = email_parts[1].split('.')[0][:2] + '...' + email_parts[1].split('.')[-1]
                email_hint = f'{username_hint}@{domain_hint}'

                message = f"Email verification sent to '{email_hint}'"
                return Response({'message': message}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



class PasswordResetView(APIView):
    def post(self, request):
        username = request.data.get('username')
        
        try:
            user = User.objects.get(username=username)

            # Generate the email hint
            email_parts = user.email.split('@')
            username_hint = email_parts[0][:2] + '...' + email_parts[0][-1]
            domain_hint = email_parts[1].split('.')[0][:2] + '...' + email_parts[1].split('.')[-1]
            email_hint = f'{username_hint}@{domain_hint}'

            # Generate a six-digit code
            code = get_random_string(length=6, allowed_chars='0123456789')
            
            # Send the code to the user's email
            subject = 'EMIS: Password Reset Code'
            html_message = render_to_string('email_templates/reset_password_code.html', {
                'user': user,
                'code': code,
            })
            from_email = settings.EMAIL_HOST_USER
            recipients = [user.email]
            msg = EmailMessage(subject, html_message, from_email, recipients)
            msg.content_subtype = 'html'  # Set the content subtype to 'html'
            msg.send()

            # Return the response with the email hint and code
            response_data = {
                'message': f"Verification code sent to '{email_hint}'",
                'code': code
            }
            return Response(response_data, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        


