# student/urls.py

app_name = 'student'

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, 
    StudentUsersView, 
    StudentPartialUpdate, 
    StudentDeleteView, 
    GetStudentView,
    StudentRetrieveView,
)

router = DefaultRouter()
router.register(r'', StudentViewSet, basename='student')


urlpatterns = [
    path('users/', StudentUsersView.as_view(), name='student_users_view'),
    path('profile/', GetStudentView.as_view(), name='get_student_view'),
    path('update-partial/<int:pk>/', StudentPartialUpdate.as_view(), name='student_partial_update'),
    path('delete/<int:pk>/', StudentDeleteView.as_view(), name='student_delete'),
    path('id/<str:user__username>/', StudentRetrieveView.as_view(), name='student-detail'),
    path('', include(router.urls)),
]


