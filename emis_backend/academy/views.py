# academy/views.py 

from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
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



class ProgramViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
    queryset = Program.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ProgramNestedSerializer
        return ProgramSerializer 



class ProgramAPIView(APIView):
    permission_classes = [IsAdministratorOrStaffOrReadOnly]

    def get(self, request, program_id=None):
        if program_id is not None:
            program = get_object_or_404(Program, id=program_id)
            serializer = ProgramSerializer(program)
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



class CourseViewSet(ModelViewSet):
    permission_classes = [IsAdministratorOrStaffOrReadOnly, ]
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
    permission_classes = [IsAdministratorOrStaffOrReadOnly]

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




