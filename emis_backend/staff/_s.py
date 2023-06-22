from rest_framework import serializers
from authentication.serializers import UserSerializer
from .models import Staff

class StaffSerializer(serializers.Serializer):
    user = UserSerializer(required=True)
    gender = serializers.ChoiceField(choices=Staff.GENDER_CHOICES, required=True)
    permanent_address = serializers.CharField(required=False, allow_blank=True)
    present_address = serializers.CharField(required=False, allow_blank=True)
    nid = serializers.CharField(required=False, allow_blank=True, max_length=20)
    photo = serializers.ImageField(required=False, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    birth_date = serializers.DateField(required=False, allow_null=True)
    father_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    mother_name = serializers.CharField(required=False, allow_blank=True, max_length=255)

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            role='staff',
            is_staff=True,
            **user_data
        )
        staff = Staff.objects.create(user=user, **validated_data)
        return staff

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        user = instance.user
        user.username = user_data['username']
        user.email = user_data['email']
        user.password = user_data['password']
        user.first_name = user_data['first_name']
        user.middle_name = user_data['middle_name']
        user.last_name = user_data['last_name']
        user.save()

        instance.gender = validated_data.get('gender', instance.gender)
        instance.permanent_address = validated_data.get('permanent_address', instance.permanent_address)
        instance.present_address = validated_data.get('present_address', instance.present_address)
        instance.nid = validated_data.get('nid', instance.nid)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.father_name = validated_data.get('father_name', instance.father_name)
        instance.mother_name = validated_data.get('mother_name', instance.mother_name)
        instance.save()

        return instance
