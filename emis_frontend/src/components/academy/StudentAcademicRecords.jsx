/**
* Calling from: StudentActivity.jsx
* Calling to: 
*/

import React from 'react';
import { getUserRole } from '../../utils/auth';


const StudentAcademicRecords = ({ setActiveComponent, breadcrumb }) => {


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('StudentAcademicRecords')}>
            <i className="bi-list-columns"></i> Academic Records
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

        <h1>StudentAcademicRecords</h1>
    </>);
};


export default StudentAcademicRecords;

