/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageCourseOffer = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('CourseOfferList');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageCourseOffer')}>
            <i className="bi-file-medical-fill"></i> Manage Term Choices
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseOfferList':
                return <CourseOfferList />;
            case 'AddCourseOffer':
                return <AddCourseOffer />;
            default:
                return <CourseOfferList />;
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
            <h2 className="text-center m-5 px-2 font-merriweather">Manage Course Offerings</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'CourseOfferList'}
                    onClick={() => setShowComponent('CourseOfferList')}>
                    List All Course Offerings
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddCourseOffer'}
                    onClick={() => setShowComponent('AddCourseOffer')}>
                    New Offer Course
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



const CourseOfferList = () => {

}


const AddCourseOffer = () => {

}



export default ManageCourseOffer; 

