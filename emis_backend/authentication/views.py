# authentication/views.py

import jwt
from authentication.permissions import IsAdministrator
from django.core.exceptions import PermissionDenied
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializer
from .models import User
from .utils import TokenDecoderToGetUserRole
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from administrator.models import Administrator
from administrator.serializers import AdministratorSerializer
from staff.models import Staff
from staff.serializers import StaffSerializer
from teacher.models import Teacher
from teacher.serializers import TeacherSerializer
from student.models import Student
from student.serializers import StudentSerializer


class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class LoginView(APIView):
    # Sign in or Login control
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.email_verified:
                login(request, user)
                refresh = RefreshToken.for_user(user)

                user_data = {
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': UserSerializer(user).data
                }

                if user.role == 'administrator':
                    administrator = Administrator.objects.filter(user=user).first()
                    if administrator is not None:
                        # Add administrator data to the user_data
                        print(AdministratorSerializer(administrator).data)
                        user_data['profile'] = AdministratorSerializer(administrator).data

                if user.role == 'staff':
                    staff = Staff.objects.filter(user=user).first()
                    if staff is not None:
                        # Add staff data to the user_data
                        staff_data = StaffSerializer(staff).data
                        
                        # Add permission groups data
                        permission_groups = staff.permission_groups.all()
                        group_data = [
                            {
                                'id': group.id,
                                'name': group.name,
                                'permissions': [
                                    {
                                        'id': permission.id,
                                        'codename': permission.codename,
                                        'name': permission.name
                                    }
                                    for permission in group.permissions.all()
                                ]
                            }
                            for group in permission_groups
                        ]                        
                        staff_data['permission_groups'] = group_data
                        
                        # Add permissions data
                        permissions = staff.permissions.all()
                        permission_data = [
                            {
                                'id': permission.id,
                                'codename': permission.codename,
                                'name': permission.name
                            }
                            for permission in permissions
                        ]
                        staff_data['permissions'] = permission_data
                        
                        user_data['profile'] = staff_data

                elif user.role == 'teacher':
                    teacher = Teacher.objects.filter(user=user).first()
                    if teacher is not None:
                        # Add teacher data to the user_data
                        user_data['profile'] = TeacherSerializer(teacher).data

                elif user.role == 'student':
                    student = Student.objects.filter(user=user).first()
                    if student is not None:
                        # Add student data to the user_data
                        user_data['profile'] = StudentSerializer(student).data

                return Response(user_data, status=status.HTTP_200_OK)
            else:
                # Add email verification information to response data
                user_data = {
                    'message': 'Email not verified',
                    'email_verified': False
                }
                return Response(user_data, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(GenericAPIView, CreateModelMixin):
    # Sign out or Logout control
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'message': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)


class UserDeleteView(DestroyModelMixin, GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class UserPartialUpdateView(UpdateModelMixin, GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class CheckPasswordView(APIView):
    # Check password authentication
    def post(self, request):
        user_id = request.data.get('user_id')
        password = request.data.get('password')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': 'Invalid user ID'}, status=status.HTTP_404_NOT_FOUND)

        user_auth = authenticate(
            request, username=user.username, password=password)
        if user_auth is not None:
            return Response({'message': 'Password authenticated successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    # Change password without old password
    def post(self, request):
        user_id = request.data.get('user_id')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': 'Invalid user ID'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class ChangePasswordUserView(APIView):
    permission_classes = [IsAuthenticated]
    # Change password
    def post(self, request):
        user_id = request.data.get('user_id')
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message': 'Invalid user ID'}, status=status.HTTP_404_NOT_FOUND)

        if check_password(old_password, user.password):
            user.set_password(new_password)
            user.save()

            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)


class ResetPasswordUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        new_password = request.data.get('new_password')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'message': 'Invalid username'}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class DeactivateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        authorization_header = request.headers.get('Authorization')

        # Check if the Authorization header is present
        if not authorization_header:
            return Response({'message': 'Access token missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Extract the access token from the Authorization header
        try:
            auth_type, access_token = authorization_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise ValueError('Invalid Authorization header')
        except ValueError:
            return Response({'message': 'Invalid Authorization header'}, status=status.HTTP_400_BAD_REQUEST)

        # Decode the access token to retrieve the user ID
        try:
            decoded_token = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except jwt.exceptions.DecodeError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response({'message': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)

        # Deactivate the user based on the retrieved user ID
        try:
            user = User.objects.get(id=user_id)
            user.is_active = False
            user.save()
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'User deactivated successfully'}, status=status.HTTP_200_OK)


class GetUserByUsernameView(APIView):
    permission_classes = [IsAdministrator]
    
    def get(self, request, *args, **kwargs):
        try:
            _username = request.GET.get('username')
            if _username is not None and isinstance(_username, str):
                _username = _username.lower()
            else:
                return Response({"success": False, "message": "Invalid username"}, status=status.HTTP_404_NOT_FOUND)

            try:
                user = User.objects.get(username=_username)
            except User.DoesNotExist:
                return Response({"success": False, "message": "User not found. Is the username correct?"}, status=status.HTTP_404_NOT_FOUND)

            user_data = {
                'user': UserSerializer(user).data
            }

            try:
                if user.role == 'administrator':
                    administrator = Administrator.objects.filter(user=user).first()
                    if administrator is not None:
                        # Add administrator data to the user_data
                        user_data['profile'] = AdministratorSerializer(administrator).data

                if user.role == 'staff':
                    staff = Staff.objects.filter(user=user).first()
                    if staff is not None:
                        # Add staff data to the user_data
                        staff_data = StaffSerializer(staff).data
                        
                        # Add permission groups data
                        permission_groups = staff.permission_groups.all()
                        group_data = [
                            {
                                'id': group.id,
                                'name': group.name,
                                'permissions': [
                                    {
                                        'id': permission.id,
                                        'codename': permission.codename,
                                        'name': permission.name
                                    }
                                    for permission in group.permissions.all()
                                ]
                            }
                            for group in permission_groups
                        ]                        
                        staff_data['permission_groups'] = group_data
                        
                        # Add permission groups data
                        permissions = staff.permissions.all()
                        permission_data = [
                            {
                                'id': permission.id,
                                'codename': permission.codename,
                                'name': permission.name
                            }
                            for permission in permissions
                        ]
                        staff_data['permissions'] = permission_data
                        
                        user_data['profile'] = staff_data

                elif user.role == 'teacher':
                    teacher = Teacher.objects.filter(user=user).first()
                    if teacher is not None:
                        # Add teacher data to the user_data
                        user_data['profile'] = TeacherSerializer(teacher).data

                elif user.role == 'student':
                    student = Student.objects.filter(user=user).first()
                    if student is not None:
                        # Add student data to the user_data
                        user_data['profile'] = StudentSerializer(student).data

            except Exception as e:
                return Response({"success": False, "message": "Cannot get the user 'profile' data", 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(user_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"success": False, "message": "Cannot get the user data", 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




