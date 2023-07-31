# academy/serializers.py 

from rest_framework import serializers, status
from authentication.serializers import UserBriefSerializer
from comments.serializers import CommentSerializer
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from student.models import Student
from student.serializers import StudentSerializer
from teacher.serializers import TeacherBriefSerializer
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
    Marksheet,
    CGPATable,
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
    term = TermChoicesSerializer(read_only=True)
    # programs = ProgramNestedSerializer(many=True, read_only=True)
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
    teacher = TeacherBriefSerializer()
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


class StudentEnrollmentNestedSerializer(serializers.ModelSerializer):
    batch_section = SectionSerializer(read_only=True)
    enrolled_by = UserBriefSerializer(read_only=True)
    updated_by = UserBriefSerializer(read_only=True)
    semester = SemesterNestedSerializer(read_only=True)

    class Meta:
        model = StudentEnrollment
        fields = '__all__'


class CourseOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOffer
        fields = '__all__'


class CourseOfferNestedSerializer(serializers.ModelSerializer):
    semester = SemesterNestedSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    teacher = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True)

    def get_teacher(self, course_offer):
        teacher = course_offer.teacher
        if teacher:
            teacher_enrollment = get_object_or_404(TeacherEnrollment, teacher=teacher)
            serializer = TeacherEnrollmentViewSerializer(teacher_enrollment)
            return serializer.data

        return None

    class Meta:
        model = CourseOffer
        fields = '__all__'


class CourseOfferSemiNestedSerializer(serializers.ModelSerializer):
    semester = SemesterNestedSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    def get_teacher(self, course_offer):
        teacher = course_offer.teacher
        if teacher:
            teacher_enrollment = get_object_or_404(TeacherEnrollment, teacher=teacher)
            serializer = TeacherEnrollmentViewSerializer(teacher_enrollment)
            return serializer.data

        return None

    class Meta:
        model = CourseOffer
        fields = '__all__'


class CourseEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseEnrollment
        fields = '__all__'

    def validate(self, data):
        # Access the relevant fields from the data dictionary
        student = data['student']
        course_offer = data['course_offer']
        regular = data['regular']
        
        
        # Check if the student has a previous enrollment with regular=True for the same course.
        previous_enrollments = CourseEnrollment.objects.filter(
            student=student,
            course_offer__course=course_offer.course,
            regular=True
        )

        if regular and previous_enrollments.exists():
            # If the student is trying to enroll in the same course with regular=True again,
            # raise a validation error with the desired error message.
            raise serializers.ValidationError("Student already enrolled in this course as 'regular course'.")

        if not regular and previous_enrollments.exists():
            # If the student is re-enrolling with regular=False, update the previous enrollments' non_credit field to True.
            previous_enrollments.update(non_credit=True)

        return data



class CourseEnrollmentNestedSerializer(serializers.ModelSerializer):
    course_offer = CourseOfferNestedSerializer(read_only=True)
    class Meta:
        model = CourseEnrollment
        fields = '__all__'


class CourseEnrollmentSemiNestedSerializer(serializers.ModelSerializer):
    course_offer = CourseOfferSemiNestedSerializer(read_only=True)
    class Meta:
        model = CourseEnrollment
        fields = '__all__'


class MarksheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marksheet
        fields = '__all__'


class MarksheetNestedSerializer(serializers.ModelSerializer):
    course_enrollment = CourseEnrollmentSerializer()
    
    class Meta:
        model = Marksheet
        fields = '__all__'

