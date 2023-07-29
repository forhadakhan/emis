/**
 * -- Manage Admin and Staff Activity --
 * 
 * Calling from: ActivityController.jsx
 */

/*******************************************************************************/
/********************************| START IMPORTS |********************************/

import React, { useState } from 'react';
import { getUserRole, hasPermission } from '../../utils/auth.js';

// User Management
import AddAdministrator from '../add-user/AddAdministrator.jsx';
import AddStaff from '../add-user/AddStaff.jsx';
import AddTeacher from '../add-user/AddTeacher.jsx';
import AddStudent from '../add-user/AddStudent.jsx';
import ManageAdministrator from '../manage-user/manage-administrator-&-staff/ManageAdministrator.jsx';
import ManageStaff from '../manage-user/manage-administrator-&-staff/ManageStaff.jsx';
import ManageProfile from '../manage-user/manage-administrator-&-staff/ManageProfile.jsx';
import ManageTeacher from '../manage-user/manage-teacher/ManageTeacher.jsx';
import ManageTeacherProfile from '../manage-user/manage-teacher/ManageTeacherProfile.jsx';
import ManageStudent from '../manage-user/manage-student/ManageStudent.jsx';
import ManageStudentProfile from '../manage-user/manage-student/ManageStudentProfile.jsx';

// Permissions
import UserPermissions from '../permissions/UserPermissions.jsx';

// Public Messages
import PublicMessages from '../public-messages/PublicMessages.jsx';

// Access Controller
import AccessController from '../auth/AccessController.jsx';

// Academy Management
import ManageTeacherDesignations from '../academy/ManageTeacherDesignations.jsx';
import ManageTermChoices from '../academy/ManageTermChoices.jsx';
import ManageInstitutes from '../academy/ManageInstitutes.jsx';
import ManageDepartments from '../academy/ManageDepartments.jsx';
import ManageDegreeTypes from '../academy/ManageDegreeTypes.jsx';
import TeacherEnrollment from '../academy/ManageTeacherEnrollment.jsx';
import ManagePrograms from '../academy/ManagePrograms.jsx';
import ManageSemesters from '../academy/ManageSemesters.jsx';
import ManageCourses from '../academy/ManageCourses.jsx';
import ManageBatches from '../academy/ManageBatches.jsx';
import ManageSections from '../academy/ManageSections.jsx';
import StudentEnrollment from '../academy/ManageStudentEnrollment.jsx';
import ManageCourseOffer from '../academy/ManageCourseOffer.jsx';
import ManageAcademicRecords from '../academy/ManageAcademicRecords.jsx';

/********************************| END IMPORTS |********************************/
/*******************************************************************************/



const ManagerialActivity = () => {
    const [activeComponent, setActiveComponent] = useState('main');
    const [reference, setReference] = useState(null);
    const [userType, setUserType] = useState(``);

    const breadcrumb = [
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('main')} ><i className="bi bi-grid-fill"></i> Activity </button>,
    ]

    const renderComponent = () => {
        switch (activeComponent) {
            case 'main':
                return <ActivityPanel setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'AddAdministrator':
                return <AddAdministrator setActiveComponent={setActiveComponent} />;
            case 'AddStaff':
                return <AddStaff setActiveComponent={setActiveComponent} />;
            case 'AddTeacher':
                return <AddTeacher setActiveComponent={setActiveComponent} />;
            case 'AddStudent':
                return <AddStudent setActiveComponent={setActiveComponent} />;
            case 'ManageAdministrator':
                return <ManageAdministrator setActiveComponent={setActiveComponent} setReference={setReference} setUserType={setUserType} />;
            case 'ManageStaff':
                return <ManageStaff setActiveComponent={setActiveComponent} setReference={setReference} setUserType={setUserType} />;
            case 'ManageProfile':
                return <ManageProfile setActiveComponent={setActiveComponent} reference={reference} userType={userType} />;
            case 'ManageTeacher':
                return <ManageTeacher setActiveComponent={setActiveComponent} setReference={setReference} breadcrumb={breadcrumb} />;
            case 'ManageTeacherProfile':
                return <ManageTeacherProfile setActiveComponent={setActiveComponent} reference={reference} breadcrumb={breadcrumb} />;
            case 'ManageStudent':
                return <ManageStudent setActiveComponent={setActiveComponent} setReference={setReference} breadcrumb={breadcrumb} />;
            case 'ManageStudentProfile':
                return <ManageStudentProfile setActiveComponent={setActiveComponent} reference={reference} breadcrumb={breadcrumb} />;
            case 'UserPermissions':
                return <UserPermissions setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'AccessController':
                return <AccessController setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'PublicMessages':
                return <PublicMessages setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageTeacherDesignations':
                return <ManageTeacherDesignations setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageTermChoices':
                return <ManageTermChoices setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageInstitutes':
                return <ManageInstitutes setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageDepartments':
                return <ManageDepartments setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageDegreeTypes':
                return <ManageDegreeTypes setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'TeacherEnrollment':
                return <TeacherEnrollment setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} setReference={setReference} />;
            case 'ManagePrograms':
                return <ManagePrograms setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageSemesters':
                return <ManageSemesters setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageCourses':
                return <ManageCourses setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageBatches':
                return <ManageBatches setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'ManageSections':
                return <ManageSections setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'StudentEnrollment':
                return <StudentEnrollment setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} setReference={setReference} />;
            case 'ManageCourseOffer':
                return <ManageCourseOffer setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} setReference={setReference} />;
            case 'ManageAcademicRecords':
                return <ManageAcademicRecords setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} setReference={setReference} />;
            default:
                return (
                    <div className='m-5 text-center'>
                        Looks like the rendering component in
                        <button
                            className="border-1 bg-transparent mx-2"
                            onClick={() => setActiveComponent('main')}>
                            Activity
                        </button>
                        is having a wild party and forgot its job description!!
                    </div>
                );
        }
    };



    return (
        <div>
            <div className="container">
                <h2 className="text-center h-4 text-darkblue">
                    <button
                        className="border-0 bg-transparent"
                        onClick={() => setActiveComponent('main')}>
                        <i className="bi bi-grid-fill text-center fs-4 d-block"></i>
                    </button>
                </h2>
                {/* Render activeComponent */}
                {renderComponent()}
            </div>
        </div>
    );
};

const ActivityPanel = ({ setActiveComponent, breadcrumb }) => {
    const user_role = getUserRole();
    const [searchTerm, setSearchTerm] = useState('');

    const elements = [
        { id: 'add_admin', label: 'Add Admin', render: 'AddAdministrator', icon: 'bi-shield-fill-plus' },
        { id: 'add_staff', label: 'Add Staff', render: 'AddStaff', icon: 'bi-shield-plus' },
        { id: 'add_teacher', label: 'Add Teacher', render: 'AddTeacher', icon: 'bi-person-plus-fill' },
        { id: 'add_student', label: 'Add Student', render: 'AddStudent', icon: 'bi-person-plus' },
        { id: 'view_admin', label: 'Manage Admin', render: 'ManageAdministrator', icon: 'bi-shield-fill-plus' },
        { id: 'view_staff', label: 'Manage Staff', render: 'ManageStaff', icon: 'bi-shield-plus' },
        { id: 'view_teacher', label: 'Manage Teacher', render: 'ManageTeacher', icon: 'bi-person-fill-gear' },
        { id: 'view_student', label: 'Manage Student', render: 'ManageStudent', icon: 'bi-person-gear' },
        { id: 'view_contactmessage', label: 'Public Messages', render: 'PublicMessages', icon: 'bi-chat-right-quote-fill' },
        { id: 'view_permission', label: 'User Permissions', render: 'UserPermissions', icon: 'bi-shield-shaded' },
        { id: 'view_termchoices', label: 'Manage Term Choices', render: 'ManageTermChoices', icon: 'bi-sign-intersection-fill' },
        { id: 'view_designation', label: 'Manage Teacher Designations', render: 'ManageTeacherDesignations', icon: 'bi-person-fill-up' },
        { id: 'view_institute', label: 'Manage Institutes', render: 'ManageInstitutes', icon: 'bi-hospital' },
        { id: 'view_department', label: 'Manage Departments', render: 'ManageDepartments', icon: 'bi-house-gear-fill' },
        { id: 'view_teacherenrollment', label: 'Teacher Enrollment', render: 'TeacherEnrollment', icon: 'bi-person-lines-fill' },
        { id: 'view_degreetype', label: 'Manage Degree Types', render: 'ManageDegreeTypes', icon: 'bi-mortarboard-fill' },
        { id: 'view_program', label: 'Manage Programs', render: 'ManagePrograms', icon: 'bi-mortarboard' },
        { id: 'view_semester', label: 'Manage Semesters', render: 'ManageSemesters', icon: 'bi-calendar2-range-fill' },
        { id: 'view_course', label: 'Manage Courses', render: 'ManageCourses', icon: 'bi-journal-medical' },
        { id: 'view_batch', label: 'Manage Batches', render: 'ManageBatches', icon: 'bi-layers' },
        { id: 'view_section', label: 'Manage Sections', render: 'ManageSections', icon: 'bi-layers-half' },
        { id: 'view_studentenrollment', label: 'Student Enrollment', render: 'StudentEnrollment', icon: 'bi-person-vcard' },
        { id: 'view_courseoffer', label: 'Manage Course Offer', render: 'ManageCourseOffer', icon: 'bi-file-medical-fill' },
        { id: 'change_marksheet', label: 'Manage Academic Records', render: 'ManageAcademicRecords', icon: 'bi-list-columns' },
        { id: 'change_user', label: 'Access Controller', render: 'AccessController', icon: 'bi-universal-access-circle' },
    ];

    let allowedElements = [];

    if (user_role === "administrator") {
        allowedElements = [...elements];
    } else if (user_role === "staff") {
        allowedElements = elements.filter((element) => hasPermission(element.id));
    }

    // Filter the elements based on the search term
    const filteredElements = allowedElements.filter(element => element.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="px-4 py-5" id="activities">

            {/* breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>

            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control text-center border border-darkblue"
                    placeholder="Find Activity"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 py-4">
                {/* Render the filtered elements */}
                {filteredElements.map(element => (
                    <div className="col p-2 mx-auto" key={element.id}>
                        <button
                            id={element.id}
                            className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100"
                            onClick={() => setActiveComponent(element.render)}
                            type='button'
                        >
                            <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                                <i className={`bi ${element.icon}`}></i>
                            </div>
                            <div className="text-beige my-auto w-100 text-end pe-2">
                                <h5 className="">{element.label}</h5>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default ManagerialActivity;
