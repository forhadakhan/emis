# press/serializers.py

from rest_framework import serializers
from authentication.serializers import UserBriefSerializer
from .models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = '__all__'


class MediaNestedSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer()
    
    class Meta:
        model = Media
        fields = '__all__'
