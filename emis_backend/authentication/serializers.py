# authentication/serializers.py

from rest_framework import serializers
from .models import User
from django.contrib.auth import get_user_model
from email_handler.views import EmailVerificationDirectView



class UserSerializer(serializers.ModelSerializer):
    
    last_login = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'role', 'password', 'first_name', 'middle_name', 'last_name', 'email_verified', 
                  'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_staff = validated_data.get('is_staff', False)
        is_active = validated_data.get('is_active', True)
        is_superuser = validated_data.get('is_superuser', False)
        email_verified = validated_data.get('email_verified', False)

        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role'],
            first_name=validated_data['first_name'],
            middle_name=validated_data['middle_name'],
            last_name=validated_data['last_name'],
            email_verified=email_verified,
            is_staff=is_staff,
            is_active=is_active,
            is_superuser=is_superuser
        )
        
        # Send verification mail
        email_verification = EmailVerificationDirectView()
        response = email_verification.send(user)

        return user


class UserSerializer2(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}


class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role', 'email', 'first_name', 'middle_name', 'last_name']

