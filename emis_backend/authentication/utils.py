# authentication/utils.py

import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from .models import User


######################################################
### Takes: authorization_header 
### Returns: decoded_token
class TokenDecoder:
    @staticmethod
    def decode_token(authorization_header):
        try:
            auth_type, access_token = authorization_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise ValueError('Invalid Authorization header')

            decoded_token = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=['HS256'])
            return decoded_token
        except (ValueError, jwt.exceptions.DecodeError):
            return None

