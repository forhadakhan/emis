# academy/models.py

from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from authentication.models import User
from teacher.models import Teacher
from student.models import Student


#####################################################################
##################### Designation:
#####################   - independent. 
#####################   linked with: create_designations().  
class Designation(models.Model):
    name = models.CharField(max_length=64)
    
    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Institute:
#####################   - independent. 
class Institute(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField(blank=True)
    about = models.TextField(blank=True)
    history = models.TextField(blank=True)

    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Department:
#####################   - dependent on: Institute. 
class Department(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField()
    about = models.TextField(blank=True)
    history = models.TextField(blank=True)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)

    def __str__(self):
        return self.acronym
#####################################################################


#####################################################################
##################### TermChoices:
#####################   independent.  
#####################   linked with: create_term_choices().  
class TermChoices(models.Model):
    name = models.CharField(max_length=100)
    start = models.CharField(max_length=24, blank=True)
    end = models.CharField(max_length=24, blank=True)

    def __str__(self):
        return self.name
#####################################################################


#####################################################################
##################### Semester:
#####################   - dependent on: TermChoices, Department
class Semester(models.Model):
    term = models.ForeignKey(TermChoices, on_delete=models.CASCADE)
    year = models.IntegerField()
    code = models.IntegerField()
    is_open = models.BooleanField(default=True)
    is_finished = models.BooleanField(default=True)
    departments = models.ManyToManyField(Department, blank=True)

    def __str__(self):
        return f'{self.term.name} {self.year}'
#####################################################################


#####################################################################
##################### Course:
#####################   - dependent on: Department.
class Course(models.Model):
    name = models.CharField(max_length=100)
    acronym = models.CharField(max_length=16)
    code = models.IntegerField()
    credit = models.IntegerField()
    prerequisites = models.ManyToManyField('self', blank=True)
    departments = models.ManyToManyField(Department, blank=True)

    def __str__(self):
        return f'{self.acronym} {self.code}'
#####################################################################


#####################################################################
##################### TeacherEnrollment:
#####################   - dependent on: Teacher, Designation, Department 
class TeacherEnrollment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    designations = models.ManyToManyField(Designation)
    departments = models.ManyToManyField(Department, on_delete=models.CASCADE)
    enrolled_by = models.ForeignKey(User, related_name='teacher_enrolled_by', on_delete=models.SET_NULL, blank=True, null=True)
    on_duty = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.teacher.acronym} - {self.designations} - {self.departments}'
#####################################################################


#####################################################################
##################### Batch, BatchAndSection:
#####################   - dependent on: Department.  
class Batch(models.Model):
    number = models.IntegerField()
    department = models.ForeignKey(Department, related_name='batch', on_delete=models.SET_NULL, blank=True, null=True)
    session = models.CharField(max_length=9, blank=True)

    def __str__(self):
        return f'{self.department}: Batch {self.number}'


class BatchAndSection(models.Model):
    batch = models.ForeignKey(Batch, related_name='sections', on_delete=models.CASCADE)
    section = models.CharField(max_length=2)

    def __str__(self):
        return f'{self.batch} - Section {self.section}'
#####################################################################


#####################################################################
##################### StudentEnrollment:
#####################   - dependent on: Student, Department, BatchAndSection, User 
class StudentEnrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    batch = models.ForeignKey(BatchAndSection, on_delete=models.CASCADE)
    enrolled_by = models.ForeignKey(User, related_name='student_enrolled_by', on_delete=models.SET_NULL, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Student Enrollment: {self.student} - {self.department} ({self.batch})'
#####################################################################


#####################################################################
##################### CourseOffer:
#####################   - dependent on: Semester, Course, Teacher
class CourseOffer(models.Model):
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)
    capacity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.course} - {self.semester} - {self.teacher}'
#####################################################################


#####################################################################
##################### CourseEnrollment:
#####################   - dependent on: CourseOffer, StudentEnrollment.
class CourseEnrollment(models.Model):
    course_offer = models.ForeignKey(CourseOffer, on_delete=models.CASCADE)
    student = models.ForeignKey(StudentEnrollment, on_delete=models.CASCADE)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return f'Course Enrollment: {self.course_offer} - {self.student}'
#####################################################################


#####################################################################
##################### Attendance:
#####################   - dependent: CourseEnrollment, Student
class Attendance(models.Model):
    course = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)
    date = models.DateField()
    present_students = models.ManyToManyField(Student, blank=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f'Attendance for {self.course_offer} on {self.date}'
#####################################################################


#####################################################################
##################### Assignment and AssignmentSubmission:
#####################   - dependent on: CourseEnrollment, Assignment, Student. 
class Assignment(models.Model):
    course = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    assign_date = models.DateField(blank=True)
    due_date = models.DateField(blank=True)
    max_marks = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f'Assignment: {self.title} ({self.course_offer})'


class AssignmentSubmission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    file_ids = models.TextField(blank=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    max_files = models.PositiveIntegerField(null=True, blank=True)
    marks = models.PositiveIntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True)

    def __str__(self):
        return f'Assignment Submission: {self.assignment.title} ({self.student})'
#####################################################################


#####################################################################
##################### Exam:
#####################   - dependent on: CourseEnrollment. 
class Exam(models.Model):
    course = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date = models.DateField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
    max_marks = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f'Exam: {self.title} ({self.course})'
#####################################################################


#####################################################################
##################### Result:
#####################   - dependent on: CourseEnrollment.
class Result(models.Model):
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('retake', 'Retake'),
        ('supplementary', 'Supplementary'),
    ]

    course_enrollment = models.ForeignKey(CourseEnrollment, on_delete=models.CASCADE)
    total_marks = models.PositiveIntegerField()
    max_marks = models.PositiveIntegerField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ongoing')
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return f'Result for {self.course_enrollment}'

#####################################################################







#####################################################################
##################### create_term_choices:
#####################   - dependent on:  TermChoices.
@receiver(post_migrate)
def create_term_choices(sender, **kwargs):
    if kwargs.get('app').__name__ == 'academy.models':
        term_choices_data = [
            {
                'name': 'Fall',
                'start': 'August',
                'end': 'December'
            },
            {
                'name': 'Autumn',
                'start': 'September',
                'end': 'December'
            },
            {
                'name': 'Spring',
                'start': 'January',
                'end': 'May'
            },
            {
                'name': 'Winter',
                'start': 'January',
                'end': 'April'
            },
            {
                'name': 'Summer',
                'start': 'May',
                'end': 'August'
            },
        ]

        for term_data in term_choices_data:
            TermChoices.objects.get_or_create(**term_data)
#####################################################################


#####################################################################
##################### create_designations:
#####################   - dependent on: Designation.
@receiver(post_migrate)
def create_designations(sender, **kwargs):
    if kwargs.get('app').__name__ == 'academy.models':
        designations_data = [
            'New Recruit',
            'Teaching Assistant',
            'Instructor',
            'Lecturer',
            'Senior Lecturer',
            'Principal Lecturer',
            'Assistant Professor',
            'Associate Professor',
            'Professor',
            'Distinguished Professor',
            'Honorary Professor',
            'Research Associate',
            'Postdoctoral Fellow',
            'Chair/Chairperson',
            'Head of Department',
            'Dean',
            'Emeritus Professor',
            'Visiting Professor',
            'Adjunct Professor',
            'Research Professor',
        ]

        for designation_name in designations_data:
            Designation.objects.get_or_create(name=designation_name)
#####################################################################



