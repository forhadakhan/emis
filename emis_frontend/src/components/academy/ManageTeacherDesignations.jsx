/**
 * Calling from: Activity.jsx
 * Calling to: 
 */

import React, { useEffect, useState } from 'react';


const ManageTeacherDesignations = ({ setActiveComponent, breadcrumb }) => {


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTeacherDesignations')}>
            <i className="bi bi-person-fill-up"></i> Manage Teacher Designations
        </button>
    );


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
            <h2 className="mt-2 px-2">Manage Teacher Designations</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button 
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`} 
                    disabled={showComponent==='DesignationList'}
                    onClick={() => setShowComponent('DesignationList')}>
                        List All Designations
                </button>
                <button 
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`} 
                    disabled={showComponent==='AddDesignation'}
                    onClick={() => setShowComponent('AddDesignation')}>
                        Add New Designation
                </button>
            </nav>

            <div className="">
            </div>
        </>
    );
}



export default ManageTeacherDesignations;