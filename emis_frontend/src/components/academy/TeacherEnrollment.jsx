/**
* Calling from: Activity.jsx
* Calling to: 
*/


import React, { useEffect, useState } from 'react';


const TeacherEnrollment = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('EnrollmentList');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('TeacherEnrollment')}>
            <i className="bi bi-person-lines-fill"></i> Teacher Enrollment
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'EnrollmentList':
                return <EnrollmentList setSelectedDepartment={setSelectedDepartment} setShowComponent={setShowComponent} />;
            case 'NewEnrollment':
                return <NewEnrollment />;
            case 'EnrollmentDetails':
                return <EnrollmentDetails enrollment={selectedDepartment} setShowComponent={setShowComponent} />;
            default:
                return <EnrollmentList setSelectedDepartment={setSelectedDepartment} setShowComponent={setShowComponent} />;
        }
    }


    return (
        <>
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>

            <h2 className="text-center m-5 px-2">Teacher Enrollment</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'EnrollmentList'}
                    onClick={() => setShowComponent('EnrollmentList')}>
                    All Enrollments
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'NewEnrollment'}
                    onClick={() => setShowComponent('NewEnrollment')}>
                    New Enrollment
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


const NewEnrollment = () => {

}


const EnrollmentList = () => {

}


const EnrollmentDetails = () => {

}




export default TeacherEnrollment;