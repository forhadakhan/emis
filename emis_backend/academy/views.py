# academy/views.py 

from comments.models import Comment
from comments.serializers import CommentSerializer, CommentNestedSerializer
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from rest_framework import status
from rest_framework.exceptions import NotFound 
from rest_framework.generics import get_object_or_404, ListAPIView, GenericAPIView, CreateAPIView, RetrieveUpdateAPIView 
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from authentication.permissions import IsAdministratorOrStaff, IsAdministratorOrStaffOrReadOnly, IsTeacher
from authentication.models import User
from authentication.serializers import UserSerializer
from student.models import Student
from student.serializers import StudentNestedSerializer
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
    StudentEnrollmentNestedSerializer,
    CourseOfferSerializer,
    CourseOfferNestedSerializer,
    CourseEnrollmentSerializer,
    CourseEnrollmentNestedSerializer,
    CourseEnrollmentSemiNestedSerializer,
    MarksheetSerializer,
    MarksheetNestedSerializer,
    AcademicRecordsForStaffSerializer,
)



class DesignationAPIView(APIView):
    """
        Handle CRUD operations for Designation model using APIView 
    """

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
    """
        Handle CRUD operations for TermChoices model using APIView 
    """

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
    """
        Handle CRUD operations for Institute model using APIView 
    """
    
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
    """
        Handle CRUD operations for Department model using APIView 
    """
    
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
    """
        Handle CRUD operations for DegreeType model using APIView 
    """

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
    """
        Handle CRUD operations for TeacherEnrollment model using APIView 
        Include nested information on GET.
    """

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
        
    
    # get enrollment info by teacher id 
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
    """
        GET an enrolled teacher by id/username  
    """
    
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
    """
        Handle CRUD operations for Program model using ModelViewSet 
    """

    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ProgramNestedSerializer
        return ProgramSerializer 



class ProgramAPIView(APIView):
    """
        GET a program data by id using APIView 
    """
    
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
    """
        Handle CRUD operations for Semester model using ModelViewSet 
    """

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
    """
        GET running semesters using APIView 
    """

    def get(self, request):
        semesters = Semester.objects.filter(is_finished=False)
        serializer = SemesterNestedSerializer(semesters, many=True)
        return Response(serializer.data)



class CourseViewSet(ModelViewSet):
    """
        Handle CRUD operations for Course model using ModelViewSet 
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseNestedSerializer
        return CourseSerializer 



class BatchViewSet(ModelViewSet):
    """
        Handle CRUD operations for Batch model using ModelViewSet 
    """

    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Batch.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return BatchNestedSerializer
        return BatchSerializer


class BatchActiveViewSet(ModelViewSet):
    """
        GET all active batches by status=True, using ModelViewSet 
    """

    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Batch.objects.filter(status=True)

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return BatchNestedSerializer
        return BatchSerializer



class BatchesByProgramAPIView(APIView):
    """
        GET all batches of a program by program id using APIView  
    """

    permission_classes = [IsAuthenticated]
    def get(self, request, program_id):
        batches = Batch.objects.filter(program_id=program_id, status=True)
        serializer = BatchSerializer(batches, many=True)
        return Response(serializer.data)



class SectionViewSet(ModelViewSet):
    """
        Handle CRUD operations for Section model using ModelViewSet 
    """

    permission_classes = [IsAdministratorOrStaffOrReadOnly]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer



class SectionByBatchAPIView(APIView):
    """
        GET all sections of a batch by batch id, using APIView  
    """

    permission_classes = [IsAuthenticated]
    
    def get(self, request, batch_id):
        sections = Section.objects.filter(batch_id=batch_id)
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)



class StudentEnrollmentAPIView(APIView):
    """
        Handle CRUD operations for StudentEnrollment model using APIView  
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, enrollment_id=None, student_id=None):
        if student_id is not None:
            enrollment = get_object_or_404(StudentEnrollment, student_id=student_id)
            serializer = StudentEnrollmentNestedSerializer(enrollment)
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
    
    # get a student's enrollment data by student id  
    def enrollment(self, student_id):
        try:
            enrollments = StudentEnrollment.objects.filter(student=student_id)
            if not enrollments:
                return None
            
            serializer = StudentEnrollmentNestedSerializer(enrollments, many=True)

            data = serializer.data
            return data[0]
        
        except Exception as e:
            return {'message': str(e)}



class CourseOfferAPIView(APIView):
    """
        Handle CRUD operations for CourseOffer model using APIView  
    """

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
    """
        GET filtered data by teacher/semester id for CourseOffer model using APIView  
    """

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



class CourseOfferCommentsView(APIView):
    """
        Handle GET and POST operations for Comments of a CourseOffer instence using APIView  
    """

    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_offer_id):
        course_offer = get_object_or_404(CourseOffer, id=course_offer_id)
        comments = Comment.objects.filter(content_type=ContentType.objects.get_for_model(CourseOffer),
                                          object_id=course_offer.id)
        serializer = CommentNestedSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, course_offer_id):
        course_offer = get_object_or_404(CourseOffer, id=course_offer_id)
        request_data = request.data
        request_data['object_id'] = course_offer.id
        request_data['content_type'] = ContentType.objects.get_for_model(CourseOffer).pk
        request_data['user'] = request.user.pk
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CourseEnrollmentView(APIView):
    """
        Handle CRUD operations for CourseEnrollment model using APIView  
    """

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
        print('serializer')
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



class CheckCourseEnrollments(APIView):
    """
    Check if a student is enrolled in an offered course by course id and student id using APIView.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, student_id):
        try:
            # Check if there are existing enrollments with the given course_id and student_id
            enrollments = CourseEnrollment.objects.filter(course_offer__course__id=course_id, student_id=student_id)

            if enrollments:
                # If enrollments exist, serialize the enrollment data and return it
                serializer = CourseEnrollmentSemiNestedSerializer(enrollments, many=True)
                data = {'is_enrolled': True, 'enrollments': serializer.data}
            else:
                # If no enrollments exist, return is_enrolled as False
                data = {'is_enrolled': False, 'enrollments': []}

            # Return the result as a JSON response
            return JsonResponse(data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)



class MarksheetViewSet(ModelViewSet):
    """
        Handle CRUD operations for Marksheet model using ModelViewSet    
    """

    permission_classes = [IsAuthenticated]
    queryset = Marksheet.objects.all()
    serializer_class = MarksheetSerializer



class StudentsInCourseOfferView(APIView):
    permission_classes = [IsAuthenticated]
    
    """
    Get all enrolled students in a course offer. 
    """
    def get(self, request, course_offer_id):
        try:
            # Retrieve all CourseEnrollment objects for the given course_offer_id
            course_enrollments = CourseEnrollment.objects.filter(course_offer_id=course_offer_id)
            
            # Retrieve the student objects from the CourseEnrollment objects
            enrolled_students = [enrollment.student for enrollment in course_enrollments]
            
            # Serialize the student data
            serializer = StudentNestedSerializer(enrolled_students, many=True)
            
            return Response(serializer.data)
        
        except CourseEnrollment.DoesNotExist:
            return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)



class MarksheetListByCourseOffer(ListAPIView):
    permission_classes = [IsAuthenticated]
    
    """
    Get all marksheets for a offered courses.
    Note: whenever a new stuudent enroll to a offered course, a new marksheet is created for that enrollment 
    """
    serializer_class = MarksheetNestedSerializer

    def get_queryset(self):
        course_offer_id = self.kwargs['course_offer_id']
        return Marksheet.objects.filter(course_enrollment__course_offer_id=course_offer_id)



class AcademicRecordsForStaff(APIView):    
    """
    Get all academic records (marksheets) for a student with details.
    Note: Serializer adds fields 'letter_grade', 'grade_point', 'remarks'. 
    """
    permission_classes = [IsAdministratorOrStaff]

    
    def get(self, request, student_id):
        # Retrieve all academic records for the specified student
        academic_records = Marksheet.objects.filter(course_enrollment__student_id=student_id)
        serializer = AcademicRecordsForStaffSerializer(academic_records, many=True)
        
        # Get total credit hours and grade points
        total_credit_hours = 0.0
        total_grade_points = 0.0
        
        for record in serializer.data:
            # Check if the course is a credit (not a non-credit) course (non_credit is False)
            if not record['course_enrollment']['non_credit']:
                # Check if 'grade_point' exists and is not None, and meets the minimum requirement (grade_point >= 2)
                if (
                    'grade_point' in record
                    and record['grade_point'] is not None
                    and record['grade_point'] >= 2
                ):
                    # Access credit_hours from the related models
                    credit_hours = record['course_enrollment']['course_offer']['course']['credit']
                    total_credit_hours += credit_hours
                    total_grade_points += float(record['grade_point']) * credit_hours
        
        # Calculate average CGPA
        average_cgpa_raw = total_grade_points / total_credit_hours if total_credit_hours > 0 else 0.0
        # Format average_cgpa_raw with up to 3 decimal places
        average_cgpa = "{:.3f}".format(average_cgpa_raw)
        
        
        # Add the average CGPA, Academic Records, and Total Credit Hours to the response data
        response_data = {
            'academic_records': serializer.data,
            'average_cgpa': average_cgpa,
            'total_credit_hours': total_credit_hours,
        }

        return Response(response_data, status=status.HTTP_200_OK)


    def patch(self, request, student_id, pk):
        # Retrieve the specific Marksheet object based on the provided 'pk' and 'student_id'
        academic_record = get_object_or_404(Marksheet, pk=pk, course_enrollment__student_id=student_id)
        serializer = AcademicRecordsForStaffSerializer(academic_record, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Save the updated data if the serializer is valid
            serializer.save()
            return Response(serializer.data)
        else:
            # Return errors if the serializer is not valid
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

