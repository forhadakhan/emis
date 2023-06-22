# staff/serializers.py

from rest_framework import serializers
from authentication.serializers import UserSerializer
from .models import Staff
from django.core.files.base import ContentFile
import base64

class StaffSerializer(UserSerializer):
    GENDER_CHOICES = (
        ('U', 'Undefined'),
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    )

    gender = serializers.ChoiceField(choices=GENDER_CHOICES, default='U')
    permanent_address = serializers.CharField(allow_blank=True, required=False)
    present_address = serializers.CharField(allow_blank=True, required=False)
    nid = serializers.CharField(max_length=20, allow_null=True, required=False)
    photo = serializers.ImageField(allow_null=True, required=False)
    phone = serializers.CharField(max_length=20, allow_blank=True, required=False)
    birth_date = serializers.DateField(allow_null=True, required=False)
    father_name = serializers.CharField(max_length=255, allow_blank=True, required=False)
    mother_name = serializers.CharField(max_length=255, allow_blank=True, required=False)
    updated_by = UserSerializer(read_only=True)
    added_by = UserSerializer(read_only=True)
    history = serializers.JSONField(allow_null=True, required=False)

    class Meta:
        model = Staff
        fields = (
            'id', 'username', 'email', 'role', 'password', 'first_name', 'middle_name', 'last_name',
            'is_staff', 'is_active', 'is_superuser', 'last_login', 'date_joined', 'gender', 'permanent_address', 'present_address', 'nid', 'photo', 'phone',
            'birth_date', 'father_name', 'mother_name', 'updated_at', 'updated_by', 'added_by',
            'history'
        )
        extra_kwargs = {'password': {'write_only': True}, 'role': {'read_only': True}}

    def create(self, validated_data):
        validated_data['role'] = 'staff'
        validated_data['added_by'] = self.context['request'].user

        # Remove the existing self.instance assignment
        nid = validated_data.pop('nid', None)
        photo_data = validated_data.pop('photo', None)

        # Call the parent create method to create the user instance
        user = super().create(validated_data)

        # Create the staff instance and assign the user to it
        staff = Staff.objects.create(user=user)

        # Update the staff instance with the provided fields
        if nid is not None:
            staff.nid = nid

        if photo_data is not None:
            photo = self.process_photo(photo_data)
            staff.photo.save(photo_data['name'], photo, save=True)

        staff.save()  # Save the staff instance with updated fields

        return staff

