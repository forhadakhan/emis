/**
 * Calling From: Activity.jsx 
 * Calling to: TeacherController.jsx
 */

import React from 'react';
import TeacherController from './TeacherController';


const ManageTeacher = ({ setActiveComponent, breadcrumb, setReference }) => {

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTeacher')}>
            <i className="bi bi-person-fill-gear"></i> Manage Teachers
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

        <h2 className="text-center m-5 px-2"><i className="bi bi-person-fill-gear"></i> Manage Teacher</h2>
        
        <TeacherController setActiveComponent={setActiveComponent} setReference={setReference} /> 

    </>);
};


export default ManageTeacher;

