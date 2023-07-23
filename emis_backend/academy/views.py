# academy/views.py 

from django.http import JsonResponse
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from authentication.permissions import IsAdministratorOrStaff, IsAdministratorOrStaffOrReadOnly, IsTeacher
from authentication.models import User
from authentication.serializers import UserSerializer
from teacher.models import Teacher

from .models import (
    Designation,
    TermChoices,
    Institute,
    Department,
    DegreeType,
    TeacherEnrollment,
    Program,
    Semester,
    Course,
    Batch,
    Section,
    StudentEnrollment,
    CourseOffer,
    CourseEnrollment,
    Marksheet,
)
from .serializers import (
    DesignationSerializer,
    InstituteSerializer,
    TermChoicesSerializer,
    DepartmentSerializer,
    DegreeTypeSerializer,
    TeacherEnrollmentSerializer,
    TeacherEnrollmentViewSerializer,
    ProgramSerializer,
    ProgramNestedSerializer,
    SemesterSerializer,
    SemesterNestedSerializer,
    CourseSerializer,
    CourseNestedSerializer,
    BatchSerializer,
    BatchNestedSerializer,
    SectionSerializer,
    StudentEnrollmentSerializer,
    StudentEnrollmentViewSerializer,
    CourseOfferSerializer,
    CourseOfferNestedSerializer,
    CourseEnrollmentSerializer,
    CourseEnrollmentNestedSerializer,
    MarksheetSerializer,
)



class DesignationAPIView(APIView):

    def get(self, request):
        permission_classes = [IsAuthenticated]
        try:
            designations = Designation.objects.all()
            serializer = DesignationSerializer(designations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = DesignationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            designation = get_object_or_404(Designation, pk=pk)
            serializer = DesignationSerializer(designation, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({'message': 'Designation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            designation = get_object_or_404(Designation, pk=pk)
            designation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({'message': 'Designation not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TermChoicesAPIView(APIView):

    def get(self, request):
        permission_classes = [IsAuthenticated]
        try:
            term_choices = TermChoices.objects.all()
            serializer = TermChoicesSerializer(term_choices, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = TermChoicesSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            term_choice = get_object_or_404(TermChoices, pk=pk)
            serializer = TermChoicesSerializer(term_choice, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({'message': 'Term Choice not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            term_choice = get_object_or_404(TermChoices, pk=pk)
            term_choice.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({'message': 'Term Choice not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class InstituteAPIView(APIView):
    
    def get(self, request):
        permission_classes = [IsAuthenticated]
        try:
            institutes = Institute.objects.all()
            serializer = InstituteSerializer(institutes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = InstituteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            institute = get_object_or_404(Institute, pk=pk)
            serializer = InstituteSerializer(institute, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Institute.DoesNotExist:
            return Response({'message': 'Institute not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            institute = get_object_or_404(Institute, pk=pk)
            institute.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Institute.DoesNotExist:
            return Response({'message': 'Institute not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class DepartmentAPIView(APIView):
    def get(self, request):
        permission_classes = [IsAuthenticated]
        try:
            departments = Department.objects.all()
            serializer = DepartmentSerializer(departments, many=True)
            # Include the nested representation of the associated Institute object
            data = serializer.data
            for department_data in data:
                institute_id = department_data['institute']
                if institute_id:
                    department_data['institute'] = self.get_institute_data(institute_id)
                else:
                    department_data['institute'] = None  # Set to null if institute_id is not present
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_institute_data(self, institute_id):
        try:
            institute = Institute.objects.get(pk=institute_id)
            serializer = InstituteSerializer(institute)
            return serializer.data
        except Institute.DoesNotExist:
            return None

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = DepartmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            department = get_object_or_404(Department, pk=pk)
            serializer = DepartmentSerializer(department, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Department.DoesNotExist:
            return Response({'message': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            department = get_object_or_404(Department, pk=pk)
            department.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Department.DoesNotExist:
            return Response({'message': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class DegreeTypeAPIView(APIView):

    def get(self, request):
        permission_classes = [IsAuthenticated]
        try:
            degree_types = DegreeType.objects.all()
            serializer = DegreeTypeSerializer(degree_types, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = DegreeTypeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            degree_type = get_object_or_404(DegreeType, pk=pk)
            serializer = DegreeTypeSerializer(degree_type, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DegreeType.DoesNotExist:
            return Response({'message': 'Degree Type not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            degree_type = get_object_or_404(DegreeType, pk=pk)
            degree_type.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except DegreeType.DoesNotExist:
            return Response({'message': 'Degree Type not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TeacherEnrollmentAPIView(APIView):

    def post(self, request):
        permission_classes = [IsAdministratorOrStaff]
        try:
            serializer = TeacherEnrollmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def patch(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            teacher_enrollment = get_object_or_404(TeacherEnrollment, pk=pk)
            serializer = TeacherEnrollmentSerializer(teacher_enrollment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TeacherEnrollment.DoesNotExist:
            return Response({'message': 'Teacher Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def delete(self, request, pk):
        permission_classes = [IsAdministratorOrStaff]
        try:
            teacher_enrollment = get_object_or_404(TeacherEnrollment, pk=pk)
            teacher_enrollment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TeacherEnrollment.DoesNotExist:
            return Response({'message': 'Teacher Enrollment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
    def get(self, request):
        try:
            teacher_enrollments = TeacherEnrollment.objects.all()
            serializer = TeacherEnrollmentViewSerializer(teacher_enrollments, many=True)

            # Retrieve the nested representations of associated models
            data = serializer.data
            for enrollment_data in data:
                enrolled_by_id = enrollment_data['enrolled_by']
                if enrolled_by_id:
                    enrollment_data['enrolled_by'] = self.get_user_data(enrolled_by_id)

                updated_by_id = enrollment_data['updated_by']
                if updated_by_id:
                    enrollment_data['updated_by'] = self.get_user_data(updated_by_id)

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def get_user_data(self, user_id):
        try:
            user = get_object_or_404(User, pk=user_id)
            user_data = {
                'username': user.username,
                'name': f"{user.first_name} {user.middle_name} {user.last_name}",
                'email': user.email,
            }
            return user_data
        except User.DoesNotExist:
            return None
        
    
    def enrollment(self, teacher_id):
        try:
            enrollments = TeacherEnrollment.objects.filter(teacher=teacher_id)
            if not enrollments:
                return None
            
            serializer = TeacherEnrollmentViewSerializer(enrollments, many=True)

            data = serializer.data
            for enrollment_data in data:
                # Remove the teacher details
                del enrollment_data['teacher']

                # get enrolled_by user info 
                enrolled_by_id = enrollment_data['enrolled_by']
                if enrolled_by_id:
                    enrollment_data['enrolled_by'] = self.get_user_data(enrolled_by_id)

                # get updated_by user info 
                updated_by_id = enrollment_data['updated_by']
                if updated_by_id:
                    enrollment_data['updated_by'] = self.get_user_data(updated_by_id)
            return data[0]
        
        except Exception as e:
            return {'message': str(e)}



class EnrolledTeacherRetrieveView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        username = request.query_params.get('username')

        if user_id:
            user = get_object_or_404(User, id=user_id)
        elif username:
            user = get_object_or_404(User, username=username)
        else:
            return Response({'error': 'Please provide a User ID or username.'}, status=status.HTTP_400_BAD_REQUEST)

        teacher = get_object_or_404(Teacher, user=user)
        teacher_enrollment = get_object_or_404(TeacherEnrollment, teacher=teacher)
        serializer = TeacherEnrollmentViewSerializer(teacher_enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)



class ProgramViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ProgramNestedSerializer
        return ProgramSerializer 



class ProgramAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, program_id=None):
        if program_id is not None:
            program = get_object_or_404(Program, id=program_id)
            serializer = ProgramNestedSerializer(program)
            return Response(serializer.data)

        programs = Program.objects.all()
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data)



class SemesterViewSet(ModelViewSet):
    queryset = Semester.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SemesterNestedSerializer
        return SemesterSerializer 

    def get_permissions(self):
        """
        We can achieve the same outcomes by applying IsAdministratorOrStaffOrReadOnly for whole view. 
        """
        if self.action in ['update', 'partial_update', 'destroy', 'create']:
            self.permission_classes = [IsAdministratorOrStaff, ]
        else:
            self.permission_classes = []
        return super(SemesterViewSet, self).get_permissions()


class OpenSemesterAPIView(APIView):
    def get(self, request):
        semesters = Semester.objects.filter(is_finished=False)
        serializer = SemesterNestedSerializer(semesters, many=True)
        return Response(serializer.data)


class CourseViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseNestedSerializer
        return CourseSerializer 



class BatchViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Batch.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return BatchNestedSerializer
        return BatchSerializer


class BatchActiveViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Batch.objects.filter(status=True)

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return BatchNestedSerializer
        return BatchSerializer



class BatchesByProgramAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, program_id):
        batches = Batch.objects.filter(program_id=program_id, status=True)
        serializer = BatchSerializer(batches, many=True)
        return Response(serializer.data)



class SectionViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer



class SectionByBatchAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, batch_id):
        sections = Section.objects.filter(batch_id=batch_id)
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)



class StudentEnrollmentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, enrollment_id=None, student_id=None):
        if student_id is not None:
            enrollment = get_object_or_404(StudentEnrollment, student_id=student_id)
            serializer = StudentEnrollmentViewSerializer(enrollment)
            return Response(serializer.data)
        
        if enrollment_id is not None:
            enrollment = get_object_or_404(StudentEnrollment, id=enrollment_id)
            serializer = StudentEnrollmentSerializer(enrollment)
            return Response(serializer.data)

        enrollments = StudentEnrollment.objects.all()
        serializer = StudentEnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudentEnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, enrollment_id):
        enrollment = get_object_or_404(StudentEnrollment, id=enrollment_id)
        serializer = StudentEnrollmentSerializer(enrollment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, enrollment_id):
        enrollment = get_object_or_404(StudentEnrollment, id=enrollment_id)
        serializer = StudentEnrollmentSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, enrollment_id):
        enrollment = get_object_or_404(StudentEnrollment, id=enrollment_id)
        enrollment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def enrollment(self, student_id):
        try:
            enrollments = StudentEnrollment.objects.filter(student=student_id)
            if not enrollments:
                return None
            
            serializer = StudentEnrollmentViewSerializer(enrollments, many=True)

            data = serializer.data
            return data[0]
        
        except Exception as e:
            return {'message': str(e)}



class CourseOfferAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        if pk:
            # Retrieve a single CourseOffer by its primary key (id)
            try:
                course_offer = CourseOffer.objects.get(pk=pk)
                serializer = CourseOfferNestedSerializer(course_offer)
                return Response(serializer.data)
            except CourseOffer.DoesNotExist:
                return Response({'error': 'CourseOffer not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Retrieve all CourseOffers
            course_offers = CourseOffer.objects.all()
            serializer = CourseOfferNestedSerializer(course_offers, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = CourseOfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            course_offer = CourseOffer.objects.get(pk=pk)
        except CourseOffer.DoesNotExist:
            return Response({'error': 'CourseOffer not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseOfferSerializer(course_offer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            course_offer = CourseOffer.objects.get(pk=pk)
        except CourseOffer.DoesNotExist:
            return Response({'error': 'CourseOffer not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseOfferSerializer(course_offer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            course_offer = CourseOffer.objects.get(pk=pk)
        except CourseOffer.DoesNotExist:
            return Response({'error': 'CourseOffer not found.'}, status=status.HTTP_404_NOT_FOUND)

        course_offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CourseOfferListFilteredView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, teacher_id=None, semester_id=None, format=None):

        if not teacher_id and not semester_id:
            return Response({'error': 'Please provide valid id.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course_offers = CourseOffer.objects.all()

            if teacher_id:
                course_offers = course_offers.filter(teacher_id=teacher_id)
            if semester_id:
                course_offers = course_offers.filter(semester_id=semester_id)

            serializer = CourseOfferNestedSerializer(course_offers, many=True)
            return Response(serializer.data)

        except CourseOffer.DoesNotExist:
            return Response({'error': 'CourseOffer not found.'}, status=status.HTTP_404_NOT_FOUND)


class CourseEnrollmentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk=None):
        if pk:
            course_enrollment = CourseEnrollment.objects.get(pk=pk)
            serializer = CourseEnrollmentNestedSerializer(course_enrollment)
        else:
            course_enrollments = CourseEnrollment.objects.all()
            serializer = CourseEnrollmentNestedSerializer(course_enrollments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CourseEnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            course_enrollment = serializer.save()
            # create a marksheet instance for this enrollment automatically 
            Marksheet.objects.create(course_enrollment=course_enrollment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        course_enrollment = CourseEnrollment.objects.get(pk=pk)
        serializer = CourseEnrollmentSerializer(course_enrollment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        course_enrollment = CourseEnrollment.objects.get(pk=pk)
        serializer = CourseEnrollmentSerializer(course_enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course_enrollment = CourseEnrollment.objects.get(pk=pk)
        course_enrollment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentEnrolledCoursesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    """
    Get all enrolled courses for a student
    """
    def get(self, request, student_id):
        try:
            # Retrieve all enrolled courses for the specified student
            enrollments_for_student = CourseEnrollment.objects.filter(student__id=student_id)

            if not enrollments_for_student.exists():
                raise NotFound('No course enrollments found for the specified student.')

            # Serialize the enrollments data
            serializer = CourseEnrollmentNestedSerializer(enrollments_for_student, many=True)

            return Response(serializer.data)
        
        except NotFound as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)


class IsEnrolled(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_offer_id, student_id):
        try:
            # Check if there's an existing enrollment with the given course_offer and student
            enrollment = CourseEnrollment.objects.filter(course_offer_id=course_offer_id, student_id=student_id).first()

            if enrollment:
                # If enrollment exists, serialize the enrollment data and return it
                serializer = CourseEnrollmentSerializer(enrollment)
                data = {'is_enrolled': True, 'enrollment': serializer.data}
            else:
                # If enrollment does not exist, return is_enrolled as False
                data = {'is_enrolled': False}

            # Return the result as JSON response
            return JsonResponse(data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


class MarksheetViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Marksheet.objects.all()
    serializer_class = MarksheetSerializer


