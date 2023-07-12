# academy/urls.py

app_name = 'academy'

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgramViewSet

from .views import (
    DesignationAPIView,
    TermChoicesAPIView,
    InstituteAPIView,  
    DepartmentAPIView,
    DegreeTypeAPIView,
    TeacherEnrollmentAPIView,
    ProgramViewSet,
    SemesterViewSet,
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet)
router.register(r'semesters', SemesterViewSet)


urlpatterns = [
    path('designations/', DesignationAPIView.as_view(), name='designations'),
    path('designations/<int:pk>/', DesignationAPIView.as_view(), name='designation-pk'),
    path('term-choices/', TermChoicesAPIView.as_view(), name='term-choices'),
    path('term-choices/<int:pk>/', TermChoicesAPIView.as_view(), name='term-choice-pk'),
    path('institutes/', InstituteAPIView.as_view(), name='institutes'),  
    path('institutes/<int:pk>/', InstituteAPIView.as_view(), name='institute-pk'),  
    path('departments/', DepartmentAPIView.as_view(), name='departments'),  
    path('departments/<int:pk>/', DepartmentAPIView.as_view(), name='department-pk'),  
    path('degree-types/', DegreeTypeAPIView.as_view(), name='degree-types'),  
    path('degree-types/<int:pk>/', DegreeTypeAPIView.as_view(), name='degree-type-pk'),  
    path('teacher-enrollment/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment'),  
    path('teacher-enrollment/<int:pk>/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment-pk'),  
    path('', include(router.urls)),
]

