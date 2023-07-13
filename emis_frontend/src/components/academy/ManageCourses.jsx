/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import Select from 'react-select'

const ManageCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('CourseList');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageCourses')}>
            <i className="bi-journal-medical"></i> Manage Courses
        </button>
    );

    // fetch existing courses  
    useEffect(() => {
        setError('');
        const fetchDepartments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/courses/`, config);
                setCourses(response.data);
            } catch (error) {
                setError(' Failed to fetch courses list.');
                console.error(error);
            }
        };

        if (courses.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch programs for select 
    useEffect(() => {
        setError('');
        const fetchDepartments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/programs/`, config);
                setPrograms(response.data);
            } catch (error) {
                setError(' Failed to fetch programs/courses list.');
                console.error(error);
            }
        };

        if (programs.length === 0) {
            fetchDepartments();
        }

    }, []);

    const courseDetail = (course) => {
        setSelectedCourse(course);
        setShowComponent('CourseDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseDetail={courseDetail} programs={programs} />;
            case 'AddCourse':
                return <AddCourse programs={programs} courses={courses} />;
            case 'CourseDetails':
                return <CourseDetail setCoures={selectedCourse} programs={programs} courses={courses} />;
            default:
                return <CourseList courseDetail={courseDetail} programs={programs} />;
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

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Courses</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'CourseList'}
                    onClick={() => setShowComponent('CourseList')}>
                    List All Courses
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddCourse'}
                    onClick={() => setShowComponent('AddCourse')}>
                    Add New Course
                </button>
            </nav>

            <div className="">
                {error && (
                    <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                        <i className="bi bi-x-octagon-fill"> </i>
                        <strong> {error} </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                    </div>
                )}

                {renderComponent()}
            </div>
        </>
    );
}

const AddCourse = () => {

}
const CourseList = () => {

}
const CourseDetail = () => {

}



export default ManageCourses;
