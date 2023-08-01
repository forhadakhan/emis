
<p align="center">
	<!-- PROJECT LOGO -->
  <a href="https://github.com/forhadakhan/emis">
    <img src="https://github.com/forhadakhan/emis/assets/67508944/7a172714-3e12-43af-97a5-cd3456b3b966" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">EMIS</h3>

  <p align="center">
    <samp>(Education Management Information System)</samp>
    <br />
    <br />
    <a href="#"><strong>Visit Live Site</strong></a>
    <br />
    <br />
    <a href="https://github.com/forhadakhan/emis/discussions/1">Discussions</a>
    ·
    <a href="https://github.com/forhadakhan/emis/issues">Bug report</a>
    ·
    <a href="https://github.com/forhadakhan/emis/issues">Feature request</a>
  </p>
</p>

<br/>

## Abstract

The 'Education Management Information System' revolutionizes educational institute management using cutting-edge web technologies such as Django, React.js, PostgreSQL, and Gmail SMTP. It offers multi-role user authentication and authorization for administrators, staff, teachers, and students. The system provides customizable permissions for users, allowing administrators to assign individual or group access levels. Key features include comprehensive information management for staff, teachers, and students, streamlined grading and assessments, robust reporting and analytics, efficient document delivery, seamless communication and collaboration, and regular updates for users.

## Technologies

#### Backend
[![Python](https://img.shields.io/badge/Python-v3.11.3-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-v4.2.2-brightgreen)](https://www.djangoproject.com/)
[![Django Rest Framework](https://img.shields.io/badge/Django%20Rest%20Framework-v3.14.0-orange)](https://www.django-rest-framework.org/)
[![DRF Simple JWT](https://img.shields.io/badge/DRF%20Simple%20JWT-v5.2.2-blue)](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-blue)](https://www.postgresql.org/)
[![Google Drive API](https://img.shields.io/badge/Google%20Drive%20API-blue)](https://developers.google.com/drive/api/)
[![Gmail SMTP](https://img.shields.io/badge/Gmail%20SMTP-orange)](https://mail.google.com/)

- Language: Python
- Framework: Django (Django Rest Framework)
- Database: PostgreSQL
- Email: Gmail SMTP
- File Storage: Google Cloud (Google Drive API)

#### Frontend
[![JavaScript](https://img.shields.io/badge/JavaScript-red)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React JS](https://img.shields.io/badge/React%20JS-v18.2.0-navyblue)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-blue)](https://getbootstrap.com/)
[![Vite](https://img.shields.io/badge/Vite-v4.3.9-purple)](https://vitejs.dev/)

- Language: JavaScript
- Library: React JS
- CSS Framework: Bootstrap
- LDS: Vite


## Features 

#### Authentication  
- Four user types: administrator, staff, teacher, student.   
- Unified login/signin interface for all users with automatic redirection to their respective dashboard/panel.   
- Email verification required for login/signin.    
- Password reset option available for forgotten passwords.    

#### Authorization    
- Administrator has unrestricted control over the system.    
- Administrator can create permission groups with related access rights (e.g., exam section, HR section).    
- Specific permission(s) or group(s) can be assigned by the administrator to staff members.    
- Staff members can only access authorized activities as per their permissions.    

#### Administrator/Staff Activities    
Authorized administrators or staff members can perform the following actions:    

- Manage Users: Add, modify, view, and remove administrators, staff, teachers, and students.    
- Manage Public Messages: View, reply, remove, and update message status.   
- Manage User Permissions: Assign and modify user access rights.    
- Manage Institutes: Handle institutes within the system.    
- Manage Departments: Organize and manage departments.   
- Manage Degree Types: Add and manage different degree types.    
- Manage Programs: Handle academic programs.    
- Manage Semesters: Organize and manage semesters.    
- Manage Courses: Add and manage courses.    
- Manage Batches and Sections: Handle batches and sections of courses.     
- Manage Course Offers: Manage the offering of courses.     
- Manage Teacher Enrollment: Enroll teachers into departments and courses.  
- Manage Student Enrollment: Enroll students into programs, semesters, batches, and sections.  
- Manage Results or Academic Records: Record and manage student academic results.          
And more features as required.    

#### Teacher Activities 
Teachers can perform the following tasks:  
- View assined courses.   
- Communicate with students in the course discussion panel.   
- Manage results for courses.   
- Update course status.   

#### Student Activities    
Students can enjoy following fetures:   
- Enroll in offered courses.    
- View and access all enrolled courses.   
- Communicate with teachers and other students in the course discussion panel.   
- View and save published results or academic records.   

#### Additional Features  
In addition to the mentioned features, the system includes:  
- Academic Calendar: Display important dates and events related to the academic year.  
- Press: Notices, announcements, and news section for important updates.  
- Individual Profile View: Access and view individual user profiles.  
- Individual Profile Settings: Modify data for individual user profiles.  
And more features as required.  
     

## License

[MIT License](./LICENSE) © 2023 [Forhad Khan](https://github.com/forhadakhan/)





<!-- 
	
	<img src="https://i.postimg.cc/7ZdXzGj1/emis-256x256.png" alt="Logo" width="80" height="80"> 
	
-->