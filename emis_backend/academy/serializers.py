# academy/serializers.py 

from rest_framework import serializers
from .models import (
    Designation,
    Institute,
    Department,
    TermChoices,
    Semester,
    Course,
    TeacherEnrollment,
    Batch,
    BatchAndSection,
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


class TermChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermChoices
        fields = '__all__'


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class TeacherEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherEnrollment
        fields = '__all__'


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class BatchAndSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchAndSection
        fields = '__all__'


class StudentEnrollmentSerializer(serializers.ModelSerializer):
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

