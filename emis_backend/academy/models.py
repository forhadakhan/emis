# academy/models.py

from django.db import models
from django.apps import AppConfig
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
#####################   linked with: create_institutes(). 
class Institute(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16, unique=True)
    code = models.IntegerField(blank=True, unique=True)
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
    acronym = models.CharField(max_length=16, unique=True)
    code = models.IntegerField(unique=True)
    about = models.TextField(blank=True)
    history = models.TextField(blank=True)
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE)

    def __str__(self):
        return self.acronym
#####################################################################


#####################################################################
##################### ProgramTypes:
#####################   independent.  
#####################   linked with: create_degree_types().  
class DegreeType(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16, unique=True)
    code = models.IntegerField(unique=True)

    def __str__(self):
        return self.acronym
#####################################################################


#####################################################################
##################### Program:
#####################   - dependent on: Department, DegreeType. 
class Program(models.Model):
    name = models.CharField(max_length=124)
    acronym = models.CharField(max_length=16, unique=True)
    code = models.IntegerField(unique=True)
    duration = models.CharField(max_length=24, blank=True)
    required_credits = models.IntegerField(null=True)
    availability = models.CharField(max_length=32, blank=True)
    entry_period = models.CharField(max_length=64, blank=True)
    details = models.TextField(blank=True)
    degree_type = models.ForeignKey(DegreeType, on_delete=models.CASCADE, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True)

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
#####################   - dependent on: TermChoices, Program
class Semester(models.Model):
    term = models.ForeignKey(TermChoices, on_delete=models.CASCADE)
    year = models.IntegerField()
    code = models.IntegerField(unique=True)
    is_open = models.BooleanField(default=True)
    is_finished = models.BooleanField(default=False)
    programs = models.ManyToManyField(Program, blank=True)

    def __str__(self):
        return f'{self.term.name} {self.year}'

    class Meta:
        unique_together = ['term', 'year']
#####################################################################


#####################################################################
##################### Course:
#####################   - dependent on: Program.
class Course(models.Model):
    name = models.CharField(max_length=100)
    acronym = models.CharField(max_length=16, unique=True)
    code = models.IntegerField(unique=True)
    credit = models.FloatField()
    prerequisites = models.ManyToManyField('self', blank=True)
    programs = models.ManyToManyField(Program, blank=True)

    def __str__(self):
        return f'{self.acronym} {self.code}'
#####################################################################


#####################################################################
##################### TeacherEnrollment:
#####################   - dependent on: Teacher, Designation, Department 
class TeacherEnrollment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    designations = models.ManyToManyField(Designation)
    departments = models.ManyToManyField(Department)
    enrolled_by = models.ForeignKey(User, related_name='teacher_enrolled_by', on_delete=models.SET_NULL, blank=True, null=True)
    updated_by = models.ForeignKey(User, related_name='teacher_enrollment_updated_by', on_delete=models.SET_NULL, blank=True, null=True)
    on_duty = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.teacher.acronym} - {self.designations} - {self.departments}'
#####################################################################


#####################################################################
##################### Batch, BatchAndSection:
#####################   - dependent on: Program.  
class Batch(models.Model):
    number = models.IntegerField()
    program = models.ForeignKey(Program, related_name='batch', on_delete=models.SET_NULL, blank=True, null=True)
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
#####################   - dependent on: Student, BatchAndSection, User 
class StudentEnrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
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
    marks = models.FloatField(null=True, blank=True)
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
    total_marks = models.FloatField(null=True, blank=True)
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
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'academy':
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
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'academy':
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


#####################################################################
##################### create_degree_types:
#####################   - dependent on: DegreeType.
@receiver(post_migrate)
def create_degree_types(sender, **kwargs):
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'academy':  
        degree_types_data = [
            {
                'name': 'Bachelor of Arts',
                'acronym': 'BA',
                'code': '101'
            },
            {
                'name': 'Bachelor of Architecture',
                'acronym': 'BArch',
                'code': '102'
            },
            {
                'name': 'Bachelor of Business Administration',
                'acronym': 'BBA',
                'code': '103'
            },
            {
                'name': 'Bachelor of Education',
                'acronym': 'BEd',
                'code': '104'
            },
            {
                'name': 'Bachelor of Engineering',
                'acronym': 'BEng',
                'code': '105'
            },
            {
                'name': 'Bachelor of Fine Arts',
                'acronym': 'BFA',
                'code': '106'
            },
            {
                'name': 'Bachelor of Pharmacy',
                'acronym': 'BPharm',
                'code': '107'
            },
            {
                'name': 'Bachelor of Science',
                'acronym': 'BSc',
                'code': '108'
            },
            {
                'name': 'Bachelor of Social Science',
                'acronym': 'BSS',
                'code': '109'
            },
            {
                'name': 'Doctor of Business Administration',
                'acronym': 'DBA',
                'code': '201'
            },
            {
                'name': 'Doctor of Social Work',
                'acronym': 'DSW',
                'code': '202'
            },
            {
                'name': 'Doctor of Education',
                'acronym': 'EdD',
                'code': '203'
            },
            {
                'name': 'Bachelor of Laws',
                'acronym': 'LLB',
                'code': '204'
            },
            {
                'name': 'Master of Laws',
                'acronym': 'LLM',
                'code': '205'
            },
            {
                'name': 'Master of Arts',
                'acronym': 'MA',
                'code': '301'
            },
            {
                'name': 'Master of Architecture',
                'acronym': 'MArch',
                'code': '302'
            },
            {
                'name': 'Master of Business Administration',
                'acronym': 'MBA',
                'code': '303'
            },
            {
                'name': 'Master of Education',
                'acronym': 'MEd',
                'code': '304'
            },
            {
                'name': 'Master of Engineering',
                'acronym': 'MEng',
                'code': '305'
            },
            {
                'name': 'Master of Fine Arts',
                'acronym': 'MFA',
                'code': '306'
            },
            {
                'name': 'Master of Philosophy',
                'acronym': 'MPhil',
                'code': '307'
            },
            {
                'name': 'Master of Science',
                'acronym': 'MSc',
                'code': '308'
            },
            {
                'name': 'Master of Social Work',
                'acronym': 'MSW',
                'code': '309'
            },
            {
                'name': 'Doctor of Pharmacy',
                'acronym': 'PharmD',
                'code': '401'
            },
            {
                'name': 'Doctor of Philosophy',
                'acronym': 'PhD',
                'code': '402'
            },
            {
                'name': 'Doctor of Psychology',
                'acronym': 'PsyD',
                'code': '403'
            },
        ]

        for degree_data in degree_types_data:
            DegreeType.objects.get_or_create(**degree_data)
#####################################################################


#####################################################################
##################### create_institutes:
#####################   - dependent on: Institute.
@receiver(post_migrate)
def create_institutes(sender, **kwargs):
    app_config = kwargs.get('app_config')
    if app_config and app_config.name == 'academy':  
        institutes = [
            {
                'name': 'Institute of Science, Technology, Engineering, and Mathematics',
                'acronym': 'STEM',
                'code': '1001',
                'about': 'The Institute of Science, Technology, Engineering, and Mathematics (STEM) offers a comprehensive education and research environment in the fields of science, technology, engineering, and mathematics, fostering innovation, problem-solving, and interdisciplinary collaboration.',
                'history': ''
            },
            {
                'name': 'Institute of Social Sciences',
                'acronym': 'ISS',
                'code': '1002',
                'about': 'The Institute of Social Sciences conducts research and offers academic programs focused on the study of societies, cultures, and human behavior.',
                'history': ''
            },
            {
                'name': 'Institute of Business and Economics',
                'acronym': 'IBE',
                'code': '1003',
                'about': 'The Institute of Business and Economics is dedicated to providing comprehensive education and research opportunities in the fields of business management, economics, and entrepreneurship.',
                'history': ''
            },
            {
                'name': 'Institute of Health Sciences',
                'acronym': 'IHS',
                'code': '1004',
                'about': 'The Institute of Health Sciences is committed to advancing healthcare through cutting-edge research, interdisciplinary collaboration, and the education of future healthcare professionals.',
                'history': ''
            },
            {
                'name': 'Institute of Humanities',
                'acronym': 'IH',
                'code': '1005',
                'about': 'The Institute of Humanities explores the diverse aspects of human thought, creativity, and expression, fostering critical thinking, cultural understanding, and artistic exploration.',
                'history': ''
            },
            {
                'name': 'Institute of Environmental Studies',
                'acronym': 'IES',
                'code': '1006',
                'about': 'The Institute of Environmental Studies focuses on understanding and addressing environmental challenges through interdisciplinary research, education, and sustainable practices.',
                'history': ''
            },
            {
                'name': 'Institute of Computing and Information Technology',
                'acronym': 'ICIT',
                'code': '1007',
                'about': 'The Institute of Computing and Information Technology is dedicated to advancing computer science, information technology, and related fields through research, innovation, and industry collaboration.',
                'history': ''
            },
            {
                'name': 'Institute of Arts and Design',
                'acronym': 'IAD',
                'code': '1008',
                'about': 'The Institute of Arts and Design offers a creative and intellectually stimulating environment for the exploration and development of artistic expression, design, and visual communication.',
                'history': ''
            },
            {
                'name': 'Institute of Communication and Media Studies',
                'acronym': 'ICMS',
                'code': '1009',
                'about': 'The Institute of Communication and Media Studies examines the dynamic and evolving nature of communication and media, exploring their social, cultural, and technological impact.',
                'history': ''
            },
            {
                'name': 'Institute of Law and Legal Studies',
                'acronym': 'ILLS',
                'code': '1010',
                'about': 'The Institute of Law and Legal Studies provides a comprehensive understanding of legal principles, ethics, and governance, preparing students for careers in law, advocacy, and policy-making.',
                'history': ''
            },
            {
                'name': 'Institute of Education and Pedagogy',
                'acronym': 'IEP',
                'code': '1011',
                'about': 'The Institute of Education and Pedagogy focuses on the theory and practice of education, preparing educators and researchers to make a positive impact on learning and instructional methodologies.',
                'history': ''
            },
            {
                'name': 'Institute of Agriculture and Rural Development',
                'acronym': 'IARD',
                'code': '1012',
                'about': 'The Institute of Agriculture and Rural Development is dedicated to advancing sustainable agricultural practices, rural development strategies, and food security through research, education, and community engagement.',
                'history': ''
            },
            {
                'name': 'Institute of Psychology and Behavioral Sciences',
                'acronym': 'IPBS',
                'code': '1013',
                'about': 'The Institute of Psychology and Behavioral Sciences investigates the complexities of human behavior, cognition, and mental processes, providing insights into individual and societal well-being.',
                'history': ''
            },
            {
                'name': 'Institute of Architecture and Urban Planning',
                'acronym': 'IAUP',
                'code': '1014',
                'about': 'The Institute of Architecture and Urban Planning explores the art and science of designing sustainable and livable built environments, addressing the challenges of urban development and architectural design.',
                'history': ''
            },
            {
                'name': 'Institute of Energy and Sustainable Resources',
                'acronym': 'IESR',
                'code': '1015',
                'about': 'The Institute of Energy and Sustainable Resources conducts research and offers educational programs focused on renewable energy, energy efficiency, and sustainable resource management, addressing global energy challenges and environmental sustainability.',
                'history': ''
            },
            {
                'name': 'Institute of Culture, Language and Literature',
                'acronym': 'ICLL',
                'code': '1016',
                'about': 'The Institute of Culture, Language, and Literature (ICLL) is a prestigious academic institution dedicated to the study and exploration of various aspects of culture, language, and literature. The ICLL offers a wide range of programs and courses that delve into the rich tapestry of human culture, linguistic diversity, and literary traditions.',
                'history': ''
            }
        ]

        for institute in institutes:
            Institute.objects.get_or_create(**institute)
#####################################################################


