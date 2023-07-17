/**
* Calling from: Activity.jsx
* Calling to: StudentController.jsx
*/

import React from 'react';
import StudentController from '../manage-user/manage-student/StudentController.jsx';


const StudentEnrollment = ({ setActiveComponent, breadcrumb, setReference }) => {

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('StudentEnrollment')}>
            <i className="bi bi-person-vcard"></i> Student Enrollment
        </button>
    );

    return (<>
        <div className="">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {updatedBreadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>
        </div>

        <h2 className="text-center m-5 px-2 font-merriweather"><i className="bi bi-person-vcard"></i> Student Enrollment</h2>
        
        <StudentController setActiveComponent={setActiveComponent} setReference={setReference} hideProfile={true} /> 
    </>);
};


export default StudentEnrollment;