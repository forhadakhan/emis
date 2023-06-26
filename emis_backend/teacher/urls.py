# teacher/urls.py

app_name = 'teacher'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet, TeacherUsersView, TeacherPartialUpdate, TeacherDeleteView, GetTeacherView

router = DefaultRouter()
router.register(r'', TeacherViewSet, basename='teacher')

urlpatterns = [
    path('users/', TeacherUsersView.as_view(), name='teacher_users_view'),
    path('profile/', GetTeacherView.as_view(), name='get_teacher_view'),
    path('update-partial/<int:pk>/', TeacherPartialUpdate.as_view(), name='teacher-partial-update'),
    path('delete/<int:pk>/', TeacherDeleteView.as_view(), name='teacher-delete'),
    path('', include(router.urls)),
]


