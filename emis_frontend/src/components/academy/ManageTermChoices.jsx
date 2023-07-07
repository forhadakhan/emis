/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';


const ManageTermChoices = ({ setActiveComponent, breadcrumb }) => {

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTermChoices')}>
            <i className="bi bi-person-fill-up"></i> Manage Term Choices
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
            <h2 className="text-center m-5 px-2">Manage Term Choices</h2>

            <div className="">
                
            </div>
        </>
    );
}




export default ManageTermChoices;