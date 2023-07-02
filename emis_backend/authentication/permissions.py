# autentication/permissions.py

from rest_framework.permissions import BasePermission, IsAuthenticated



class IsAdministrator(BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated
        is_authenticated = IsAuthenticated().has_permission(request, view)

        if is_authenticated and request.user.role:
            # Check if the user's role is 'administrator'
            return request.user.role == 'administrator'
            
        return False

    def handle_permission_denied(self, request, message='Permission denied'):
        if request.user.role:
            role = request.user.role.capitalize()
            error_message = f"{role} is unauthorized to make this request"
            return Response({'detail': f"{message}. {error_message}"}, status=status.HTTP_403_FORBIDDEN)
            
        return Response({'detail': message}, status=status.HTTP_403_FORBIDDEN)






