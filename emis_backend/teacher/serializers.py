from rest_framework import serializers
from .models import Teacher
from authentication.serializers import UserSerializer, UserBriefSerializer


class TeacherViewSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__" 


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Use the UserSerializer to serialize the user related fields
    class Meta:
        model = Teacher
        fields = "__all__" 


class TeacherBriefSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer()  # Use the UserBriefSerializer to serialize the user related fields 
    class Meta:
        model = Teacher
        fields = ['id', 'acronym', 'phone', 'photo_id', 'gender', 'user']
