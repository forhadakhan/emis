/**
 * Calling from: ManagerialActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';


// Main Component 
const ManageAcademicRecords = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('FindAStudent');

    // add current component in breadcrumb 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageAcademicRecords')}>
            <i className="bi-list-columns"></i> Manage Academic Records
        </button>
    );

    // check and return selected compnent to show and  
    const renderComponent = () => {
        switch (showComponent) {
            case 'ListAllStudent':
                return <ListAllStudent />;
            case 'FindAStudent':
                return <FindAStudent />;
            default:
                return <><p className='text-center m-5'>Something went wrong while rendering component!</p></>;
        }
    }


    return (
        <>
            {/* breadcrumb */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* headings  */}
            <h2 className="text-center m-5 px-2">
                <i className="bi-list-columns"></i> Manage Academic Records
            </h2>

            {/* student select option  */}
            <nav className="nav nav-pills flex-column flex-sm-row my-4">

                {/* option to find a student by username  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'FindAStudent'}
                    onClick={() => setShowComponent('FindAStudent')}>
                    Find a student
                </button>

                {/* option to find a student from all student list  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'ListAllStudent'}
                    onClick={() => setShowComponent('ListAllStudent')}>
                    List all student 
                </button>
            </nav>

            {/* render component based on preference  */}
            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


// Sub Component 
const FindAStudent = () => {

}


// Sub Component 
const ListAllStudent = () => {

}




export default ManageAcademicRecords; 

