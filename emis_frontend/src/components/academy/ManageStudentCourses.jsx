/**
 * Calling from: StudentActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getEnrollmentData, getProfileData } from '../../utils/auth.js';


const ManageStudentCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const studentProfile = getProfileData();
    const studentId = studentProfile.id;
    const enrollment = getEnrollmentData();
    const semester = enrollment.semester;
    const [showComponent, setShowComponent] = useState('CourseList');
    const [courses, setCourses] = useState([]);
    const [courseOffer, setCourseOffer] = useState('');
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState('');


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageStudentCourses')}>
            <i className="bi-journal-medical"></i> My Courses
        </button>
    );

    const fetchEnrolledCourses = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/student/${studentId}/enrollments/`, config);
            setEnrolledCourses(response.data);
            console.log(response.data);
        } catch (error) {
            if (error.response.status == 404) {
                setError('No enrolled course(s) found for you. ');
            } else {
                setError(' Failed to fetch course  list.');
            }
            // console.error('Error fetching course list:', error);
        }
    };
    useEffect(() => {
        if ((enrolledCourses.length < 1)) {
            fetchEnrolledCourses();
        }
    }, []);



    // fetch courses for Prerequisites
    useEffect(() => {
        setError('');
        const fetchCourses = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/courses/`, config);
                const coursesById = {};
                const data = response.data;
                // Create a dictionary for faster lookup
                data.forEach((course) => {
                    coursesById[course.id] = course;
                });
                setCourses(coursesById);
            } catch (error) {
                setError('An error occurred while fetching courses list.');
                console.error(error);
            }
        };

        if (courses.length === 0) {
            fetchCourses();
        }

    }, []);

    const getPrerequisites = (ids) => {
        const prerequisiteCourses = [];

        // Iterate through the given ids and find prerequisite courses
        ids.forEach((id) => {
            const course = courses[id];
            if (course) {
                prerequisiteCourses.push(course);
            }
        });

        return prerequisiteCourses;
    };



    const handleBack = async () => {
        setShowComponent('CourseList');
    };


    const courseView = (course) => {
        setCourseOffer(course);
        setShowComponent('CourseDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseView={courseView} enrolledCourses={enrolledCourses} />
            case 'CourseDetails':
                return <CourseDetails courseOffer={courseOffer} handleBack={handleBack} getPrerequisites={getPrerequisites} />
            default:
                return <CourseList courseView={courseView} courseOfferings={enrolledCourses} />
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
                <i className="bi-journal-medical"></i> My Courses
            </h2>


            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            {renderComponent()};

        </>
    );
}


const CourseList = ({ courseView, enrolledCourses }) => {}


const CourseDetails = ({ courseOffer, handleBack, getPrerequisites }) => {}



export default ManageStudentCourses;

