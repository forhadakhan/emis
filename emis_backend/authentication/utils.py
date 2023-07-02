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


######################################################
### Takes: authorization_header 
### Returns: user_id
class TokenDecoderToGetUserId:
    @staticmethod
    def decode_token(authorization_header):

        # Check if the Authorization header is present
        if not authorization_header:
            return Response({'message': 'Authorization/Access token missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract the access token from the Authorization header
        try:
            auth_type, access_token = authorization_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise ValueError('Invalid Authorization header')
        except ValueError:
            return Response({'message': 'Invalid Authorization header'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode the access token to retrieve and return the user ID
        try:
            decoded_token = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
            return user_id
        except jwt.exceptions.DecodeError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)


