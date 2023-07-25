# comments/serializers.py 

from authentication.serializers import UserBriefSerializer
from rest_framework import serializers
from comments.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class CommentNestedSerializer(serializers.ModelSerializer):
    user = UserBriefSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'


