# authentication/urls.py

app_name = 'authentication'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    UserViewSet,
    LoginView,
    LogoutView,
    UserDeleteView,
    UserPartialUpdateView,
    ChangePasswordUserView,
    CheckPasswordView,
    ChangePasswordView,
    DeactivateUserView,
    ResetPasswordUserView,
    GetUserByUsernameView
)


router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    path('auth/', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user/delete/<int:pk>/', UserDeleteView.as_view(), name='user_delete'),
    path('user/update-partial/<int:pk>/', UserPartialUpdateView.as_view(), name='user_update'),
    path('check-password/', CheckPasswordView.as_view(), name='check_password'),
    path('change-password-by-admin/', ChangePasswordView.as_view(), name='change_password'),
    path('change-password/', ChangePasswordUserView.as_view(), name='change_password'),
    path('reset-password/', ResetPasswordUserView.as_view(), name='reset_password'),
    path('deactivate-me/', DeactivateUserView.as_view(), name='diactivate_me'),
    path('get-user/', GetUserByUsernameView.as_view(), name='get_user'),
]



