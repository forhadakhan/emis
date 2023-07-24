/**
 * Calling from: TeacherActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getProfileData } from '../../utils/auth.js';

import CourseList from './course-control/CourseList.jsx'
import CourseDetails from './course-control/CourseDetails.jsx'


const ManageTeacherCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const teacherProfile = getProfileData();
    const teacherId = teacherProfile.id;
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('');
    const [courseOffer, setCourseOffer] = useState('');
    const [courseOfferings, setCourseOfferings] = useState([]);


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTeacherCourses')}>
            <i className="bi-journal-medical"></i> Manage Courses
        </button>
    );

    const fetchCourseOfferings = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/teacher/${teacherId}/course_offers/`, config);
            setCourseOfferings(response.data);
        } catch (error) {
            setError(' Failed to fetch course  list.');
            console.error('Error fetching course list:', error);
        }
    };
    useEffect(() => {
        fetchCourseOfferings();
    }, []);


    const handleBack = async () => {
        setShowComponent('CourseList');
    };


    const courseOfferView = (courseOffer) => {
        setCourseOffer(courseOffer);
        setShowComponent('CourseDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseOfferView={courseOfferView} courseOfferings={courseOfferings} />
            case 'CourseDetails':
                return <CourseDetails courseOffer={courseOffer} handleBack={handleBack} />
            default:
                return <CourseList courseOfferView={courseOfferView} courseOfferings={courseOfferings} />
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

            <h2 className="text-center m-5 px-2 font-merriweather">
                <i className="bi-journal-medical"></i> Manage Courses
            </h2>

            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


export default ManageTeacherCourses;

