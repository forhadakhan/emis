/**
 * -- Manage Student Activity --
 * 
 * Calling from: ActivityController.jsx
 */

/*******************************************************************************/
/********************************| START IMPORTS |********************************/

import React, { useState } from 'react';
import { getEnrollmentData } from '../../utils/auth.js';

import StudentCourseEnroll from '../academy/StudentCourseEnroll';

/********************************| END IMPORTS |********************************/
/*******************************************************************************/



const StudentActivity = () => {
    const [activeComponent, setActiveComponent] = useState('main');

    const breadcrumb = [
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('main')} ><i className="bi bi-grid-fill"></i> Activity </button>,
    ]

    const renderComponent = () => {
        switch (activeComponent) {
            case 'main':
                return <ActivityPanel setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
            case 'StudentCourseEnroll':
                return <StudentCourseEnroll setActiveComponent={setActiveComponent} breadcrumb={breadcrumb} />;
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
    const enrollment = getEnrollmentData();
    const [searchTerm, setSearchTerm] = useState('');

    const elements = [
        { id: 'StudentCourseEnroll', label: 'Course Enrollment', render: 'StudentCourseEnroll', icon: 'bi-plus-square-fill' },
    ];

    let allowedElements = [];

    if (enrollment) {
        allowedElements = [...elements];
    } 
    // else {
    //     allowedElements = elements.filter((element) => hasPermission(element.id));
    // }

    // Filter the elements based on the search term
    const filteredElements = allowedElements.filter(element => element.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="px-4 py-5" id="activities">
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



export default StudentActivity;
