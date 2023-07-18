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
    OpenSemesterAPIView,
    CourseViewSet,
    BatchViewSet,
    BatchActiveViewSet,
    BatchesByProgramAPIView,
    SectionViewSet,
    SectionByBatchAPIView,
    StudentEnrollmentAPIView,
    ProgramAPIView,
    CourseOfferAPIView,
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet)
router.register(r'semesters', SemesterViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'batches', BatchViewSet)
router.register(r'active-batches', BatchActiveViewSet)
router.register(r'sections', SectionViewSet)


urlpatterns = [
    path('designations/', DesignationAPIView.as_view(), name='designations'),
    path('designations/<int:pk>/', DesignationAPIView.as_view(), name='designation-pk'),
    path('term-choices/', TermChoicesAPIView.as_view(), name='term-choices'),
    path('term-choices/<int:pk>/', TermChoicesAPIView.as_view(), name='term-choice-pk'),
    path('institutes/', InstituteAPIView.as_view(), name='institutes'),  
    path('institutes/<int:pk>/', InstituteAPIView.as_view(), name='institute-pk'),  
    path('departments/', DepartmentAPIView.as_view(), name='departments'),  
    path('departments/<int:pk>/', DepartmentAPIView.as_view(), name='department-pk'),  
    path('open-semesters/', OpenSemesterAPIView.as_view(), name='open_semesters'), 
    path('degree-types/', DegreeTypeAPIView.as_view(), name='degree-types'),  
    path('degree-types/<int:pk>/', DegreeTypeAPIView.as_view(), name='degree-type-pk'),  
    path('programs/<int:program_id>/', ProgramAPIView.as_view(), name='get-program'),
    path('teacher-enrollment/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment'),  
    path('teacher-enrollment/<int:pk>/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment-pk'),  
    path('student-enrollment/', StudentEnrollmentAPIView.as_view(), name='student-enrollment'),  
    path('student-enrollment/<int:enrollment_id>/', StudentEnrollmentAPIView.as_view(), name='student-enrollment-pk'),  
    path('students/<int:student_id>/enrollment/', StudentEnrollmentAPIView.as_view(), name='student-id-enrollment'),
    path('batches/program/<int:program_id>/', BatchesByProgramAPIView.as_view(), name='batches-of-program'),  
    path('sections/batch/<int:batch_id>/', SectionByBatchAPIView.as_view(), name='sections-of-batch'),  
    path('course-offers/', CourseOfferAPIView.as_view(), name='course-offer'),
    path('course-offers/<int:pk>/', CourseOfferAPIView.as_view(), name='course-offer-detail'),
    path('', include(router.urls)),
]

