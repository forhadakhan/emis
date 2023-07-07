/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';


const ManageInstitutes = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('TermList');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageInstitutes')}>
            <i className="bi bi-house-gear-fill"></i> Manage Term Choices
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

            <h2 className="text-center m-5 px-2">Manage Institutes</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'TermList'}
                    onClick={() => setShowComponent('TermList')}>
                    List All Terms
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddTerm'}
                    onClick={() => setShowComponent('AddTerm')}>
                    Add New Term
                </button>
            </nav>

            <div className="">
                
            </div>
        </>
    );
}



export default ManageInstitutes;