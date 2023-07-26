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
    EnrolledTeacherRetrieveView,
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
    CourseOfferListFilteredView,
    CourseEnrollmentView,
    MarksheetViewSet,
    IsEnrolled,
    StudentEnrolledCoursesAPIView,
    StudentsInCourseOfferView,
    MarksheetListByCourseOffer,
    CourseOfferCommentsView,
)

router = DefaultRouter()
router.register(r'programs', ProgramViewSet)
router.register(r'semesters', SemesterViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'batches', BatchViewSet)
router.register(r'active-batches', BatchActiveViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'marksheets', MarksheetViewSet)


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
    path('programs/get/<int:program_id>/', ProgramAPIView.as_view(), name='get-program'),
    path('teacher-enrollment/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment'),  
    path('teacher-enrollment/<int:pk>/', TeacherEnrollmentAPIView.as_view(), name='teacher-enrollment-pk'),  
    path('get-enrolled-teacher/', EnrolledTeacherRetrieveView.as_view(), name='get-enrolled-teacher'),  
    path('student-enrollment/', StudentEnrollmentAPIView.as_view(), name='student-enrollment'),  
    path('student-enrollment/<int:enrollment_id>/', StudentEnrollmentAPIView.as_view(), name='student-enrollment-pk'),  
    path('students/<int:student_id>/enrollment/', StudentEnrollmentAPIView.as_view(), name='student-id-enrollment'),
    path('batches/program/<int:program_id>/', BatchesByProgramAPIView.as_view(), name='batches-of-program'),  
    path('sections/batch/<int:batch_id>/', SectionByBatchAPIView.as_view(), name='sections-of-batch'),  
    path('course-offers/', CourseOfferAPIView.as_view(), name='course-offer'),
    path('course-offers/<int:pk>/', CourseOfferAPIView.as_view(), name='course-offer-detail'),
    path('teacher/<int:teacher_id>/course_offers/', CourseOfferListFilteredView.as_view(), name='course_offers_by_teacher'),
    path('semester/<int:semester_id>/course_offers/', CourseOfferListFilteredView.as_view(), name='course_offers_by_semester'),
    path('course-enrollment/', CourseEnrollmentView.as_view(), name='course_enrollment'),
    path('course-enrollment/<int:pk>/', CourseEnrollmentView.as_view(), name='course_enrollment_detail'),
    path('course/is-enrolled/<int:course_offer_id>/<int:student_id>/', IsEnrolled.as_view(), name='is-enrolled'),
    path('student/<int:student_id>/enrollments/', StudentEnrolledCoursesAPIView.as_view(), name='student_enrollments'),
    path('course_offer/<int:course_offer_id>/students/', StudentsInCourseOfferView.as_view(), name='students_in_course_offer'),
    path('course-offer/marksheets/<int:course_offer_id>/', MarksheetListByCourseOffer.as_view(), name='marksheet-list-by-course-offer'),
    path('courseoffer/<int:course_offer_id>/comments/', CourseOfferCommentsView.as_view(), name='course_offer_discussion_comment'),
    path('', include(router.urls)),
]

