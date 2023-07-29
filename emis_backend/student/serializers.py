from rest_framework import serializers
from .models import Student
from authentication.serializers import UserSerializer2, UserBriefSerializer

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__" 


class StudentNestedSerializer(serializers.ModelSerializer):
    user = UserSerializer2(read_only=True)
    class Meta:
        model = Student
        fields = "__all__" 



class StudentUsersSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer()
    class Meta:
        model = Student
        fields = "__all__" 


