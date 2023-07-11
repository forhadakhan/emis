from rest_framework import serializers
from .models import Teacher
from authentication.serializers import UserSerializer


class TeacherViewSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__" 

class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Use the UserSerializer for the user field
    class Meta:
        model = Teacher
        fields = "__all__" 
