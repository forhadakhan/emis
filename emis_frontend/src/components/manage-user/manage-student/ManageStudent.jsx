/**
 * Calling From: Activity.jsx 
 * Calling to: StudentController.jsx
 */

import React from 'react';
import StudentController from './StudentController';


const ManageStudent = ({ setActiveComponent, breadcrumb, setReference }) => {

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageStudent')}>
            <i className="bi bi-person-gear"></i> Manage Students
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

        <h2 className="text-center m-5 px-2 font-merriweather"><i className="bi bi-person-gear"></i> Manage Student</h2>
        
        <StudentController setActiveComponent={setActiveComponent} setReference={setReference} /> 

    </>);
};


export default ManageStudent;

