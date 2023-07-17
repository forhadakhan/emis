# academy/serializers.py 

from rest_framework import serializers
from authentication.serializers import UserBriefSerializer
from student.models import Student
from student.serializers import StudentSerializer
from teacher.serializers import TeacherSerializer
from teacher.models import Teacher

from .models import (
    Designation,
    Institute,
    Department,
    DegreeType,
    Program,
    TermChoices,
    Semester,
    Course,
    TeacherEnrollment,
    Batch,
    Section,
    StudentEnrollment,
    CourseOffer,
    CourseEnrollment,
    Attendance,
    Assignment,
    AssignmentSubmission,
    Exam,
    Result,
)


class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = '__all__'


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class DegreeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeType
        fields = '__all__'


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'


class ProgramNestedSerializer(serializers.ModelSerializer):
    degree_type = DegreeTypeSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Program
        fields = '__all__'


class TermChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermChoices
        fields = '__all__'


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'


class SemesterNestedSerializer(serializers.ModelSerializer):
    programs = ProgramNestedSerializer(many=True, read_only=True)
    class Meta:
        model = Semester
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class CourseNestedSerializer(serializers.ModelSerializer):
    prerequisites = serializers.SerializerMethodField()
    programs = ProgramNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def get_prerequisites(self, obj):
        prerequisites = CourseNestedSerializer(obj.prerequisites.all(), many=True).data
        return prerequisites


class TeacherEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherEnrollment
        fields = '__all__'


class TeacherEnrollmentViewSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer()
    designations = DesignationSerializer(many=True)
    departments = serializers.SerializerMethodField()

    class Meta:
        model = TeacherEnrollment
        fields = '__all__'

    def get_departments(self, obj):
        departments = obj.departments.all()
        department_data = DepartmentSerializer(departments, many=True).data
        return self.filter_department_fields(department_data)

    def filter_department_fields(self, department_data):
        filtered_data = []
        fields_to_include = ['id', 'name', 'acronym', 'code']
        
        for department in department_data:
            filtered_department = {key: department[key] for key in fields_to_include if key in department}
            filtered_data.append(filtered_department)
        
        return filtered_data


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    available_seats = serializers.SerializerMethodField()
    batch_data = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = '__all__'

    def get_available_seats(self, obj):
        enrolled_count = StudentEnrollment.objects.filter(batch_section=obj).count()
        return obj.max_seats - enrolled_count

    def get_batch_data(self, obj):
        try:
            batch = Batch.objects.get(id=obj.batch.id)
            batch_serializer = BatchSerializer(batch)
            return batch_serializer.data
        except Batch.DoesNotExist:
            return None



class BatchNestedSerializer(serializers.ModelSerializer):
    program = ProgramNestedSerializer(read_only=True)
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Batch
        fields = '__all__'



class StudentEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEnrollment
        fields = '__all__'


class StudentEnrollmentViewSerializer(serializers.ModelSerializer):
    batch_section = SectionSerializer(read_only=True)
    enrolled_by = UserBriefSerializer(read_only=True)
    updated_by = UserBriefSerializer(read_only=True)

    class Meta:
        model = StudentEnrollment
        fields = '__all__'


class CourseOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOffer
        fields = '__all__'


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'

