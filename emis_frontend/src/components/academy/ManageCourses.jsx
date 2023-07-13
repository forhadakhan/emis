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


const CourseList = () => {

}
const CourseDetail = () => {

}

const AddCourse = ({ courses, programs }) => {
    const accessToken = getAccessToken();
    const form = {
        name: '',
        acronym: '',
        code: '',
        credit: '',
        prerequisites: [],
        programs: [],
    }
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(form);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);


    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.name}`
    }));

    const courseOptions = courses.map(course => ({
        value: course.id,
        label: `${course.acronym} ${course.code} - ${course.name}`
    }));


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleProgramChange = (selectedOptions) => {
        setSelectedPrograms(selectedOptions);
        const programIds = selectedOptions.map(program => program.value);
        setFormData({ ...formData, programs: programIds });
    };

    const handleCourseChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
        const courseIds = selectedOptions.map(course => course.value);
        setFormData({ ...formData, prerequisites: courseIds });
    };


    const resetForm = () => {
        setFormData(form);
        setSelectedCourses([]);
        setSelectedPrograms([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/courses/`, formData, config);
            // clear form
            resetForm();
            setMessage('Course added successfully.');
            setError('');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            return errorArray.map(error => `[${key}] ${error}`);
                        } else if (typeof errorArray === 'object') {
                            const errorMessage = Object.values(errorArray).join(' ');
                            return [`[${key}] ${errorMessage}`];
                        } else {
                            return [`[${key}] ${errorArray}`];
                        }
                    })
                    .join('\n');

                if (errorMessages) {
                    setError(`Error creating Course. \n${errorMessages}`);
                } else {
                    setError('Error creating Course. Please try again.');
                }
            } else {
                setError('Error creating Course. Please try again.');
            }
            setMessage('');
            console.error('Error creating Course:', error);
        }
    };

    return (
        <div>

            {message && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {message} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMessage('')}></button>
                </div>
            )}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="d-flex">
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Course name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Acronym:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="acronym"
                                value={formData.acronym}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Code:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Credit: </label>
                            <input
                                type="number"
                                className="form-control"
                                name="credit"
                                value={formData.credit}
                                onChange={handleInputChange}
                                placeholder='e.g. 3'
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Select Prerequisites: </label>
                            <Select
                                options={courseOptions}
                                isMulti
                                value={selectedCourses}
                                onChange={handleCourseChange}
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">For which program(s): </label>
                            <Select
                                options={programOptions}
                                isMulti
                                value={selectedPrograms}
                                onChange={handleProgramChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Course</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};



export default ManageCourses;
