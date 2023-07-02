# authentication/utils.py

import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from .models import User

