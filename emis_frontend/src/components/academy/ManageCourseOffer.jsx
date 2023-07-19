/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Select from 'react-select'
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageCourseOffer = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [alertMessage, setAlertMessage] = useState('');
    const [showComponent, setShowComponent] = useState('CourseOfferList');
    const [semesters, setSemesters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageCourseOffer')}>
            <i className="bi-file-medical-fill"></i> Manage Term Choices
        </button>
    );

    // fetch semester for select at CourseOfferForm
    useEffect(() => {
        setAlertMessage('');
        const fetchSemesters = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/open-semesters/`, config);
                setSemesters(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching open semesters list.');
                console.error(error);
            }
        };

        if (semesters.length === 0) {
            fetchSemesters();
        }

    }, []);

    // fetch courses for select at CourseOfferForm
    useEffect(() => {
        setAlertMessage('');
        const fetchSemesters = async () => {
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
                setAlertMessage('An error occurred while fetching courses list.');
                console.error(error);
            }
        };

        if (semesters.length === 0) {
            fetchSemesters();
        }

    }, []);

    // fetch enrolled teachers for select at CourseOfferForm
    useEffect(() => {
        setAlertMessage('');
        const fetchTeachers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const response = await axios.get(`${API_BASE_URL}/academy/teacher-enrollment/`, config);
                setTeachers(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching enrolled teachers list.');
                console.error(error);
            }
        };

        if (teachers.length === 0) {
            fetchTeachers();
        }
    }, []);

    // get an enrolled teacher by id/username 
    const getTeacher = async (id = null, username = '') => {
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/get-enrolled-teacher/`, {
                params: {
                    user_id: id,
                    username: username,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        } catch (error) {
            return error;
            console.error(error);
        }
    };



    const handleBack = async () => {
        setShowComponent('CourseOfferList');
    };


    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseOfferList':
                return <CourseOfferList teachers={teachers} semesters={semesters} courses={courses} getTeacher={getTeacher} handleBack={handleBack} />;
            case 'AddCourseOffer':
                return <AddCourseOffer teachers={teachers} semesters={semesters} courses={courses} getTeacher={getTeacher} handleBack={handleBack} />;
            default:
                return <CourseOfferList teachers={teachers} semesters={semesters} courses={courses} getTeacher={getTeacher} handleBack={handleBack} />;
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

            {alertMessage && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong>{alertMessage}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                </div>
            )}

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



const CourseOfferList = () => {

}


const AddCourseOffer = ({ semesters, courses, teachers, getTeacher, handleBack }) => {

    return (
        <CourseOfferForm teachers={teachers} semesters={semesters} courses={courses} getTeacher={getTeacher} handleBack={handleBack} />
    );
}



const CourseOfferForm = ({ semesters, courses, courseOffer = {}, teachers, getTeacher, handleBack }) => {
    const accessToken = getAccessToken();
    const initForm = {
        semester: '',
        course: '',
        teacher: '',
        capacity: '',
    }
    const [alertMessage, setAlertMessage] = useState('');
    const [isDetail, setIsDetail] = useState(Object.entries(courseOffer).length !== 0);
    const [isDelete, setIsDelete] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [courseOfferId, setCourseOfferId] = useState('');
    // const [teacherUsername, setTeacherUsername] = useState('');
    // const [teacherId, setTeacherId] = useState(null);
    // const [teacher, setTeacher] = useState('');


    const courseOptions = courses.map(course => ({
        value: course.id,
        label: `${course.code}: ${course.name}`
    }));

    const semestermOptions = semesters.map(semester => ({
        value: semester.id,
        isDisabled: !semester.is_open,
        label: `${semester.term.name} ${semester.year} (${semester.term.start} to ${semester.term.end})`
    }));

    const teacherOptions = teachers.map(enrollment => ({
        value: enrollment.teacher.id,
        label: `${enrollment.teacher.user.first_name} ${enrollment.teacher.user.middle_name} ${enrollment.teacher.user.last_name} (${enrollment.teacher.acronym})`
    }));


    // in case we are viewing an existing course offerings, set the present data to formData
    const setPresentData = () => {
        const data = {
            semester: courseOffer.semester,
            course: courseOffer.course,
            teacher: courseOffer.teacher,
            capacity: courseOffer.capacity,
        }
        setFormData(data)
        const course = courses.find((course) => course.value === data.course);
        const semester = semesters.find((semester) => semester.id === data.semester);
        setSelectedCourse({ isDisabled: true, value: course.id, label: `${course.code}: ${course.name}` });
        setSelectedSemester(semester
            ? {
                isDisabled: true,
                value: data.semester,
                label: `${semester.term.name} ${semester.year} (${semester.term.start} to ${semester.term.end})`
            }
            : {
                isDisabled: true,
                value: '',
                label: `Assigned semester may be closed.`

            });
        setIsDetail(true);
    }
    useEffect(() => {
        if (isDetail) {
            setPresentData();
        }
    }, [isDetail])


    const resetData = () => {
        if (isDetail) {
            setPresentData();
        } else {
            setIsDetail(false);
            setAlertMessage('');
            setSelectedSemester('');
            setSelectedCourse('');
            setSelectedTeacher('');
        }
    }


    const handleSemesterChange = (selectedOption) => {
        setSelectedSemester(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, semester: parseInt(selectedOption.value) });
        }
    };

    const handleCourseChange = (selectedOption) => {
        setSelectedCourse(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, course: parseInt(selectedOption.value) });
        }
    }

    const handleTeacherChange = (selectedOption) => {
        setSelectedTeacher(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, teacher: parseInt(selectedOption.value) });
        }
    }

    const handleCapacityChange = (e) => {
        setFormData({ ...formData, capacity: e.target.value });
    }

    // const findTeacher = async () => {
    //     const data = await getTeacher(teacherId, teacherUsername);

    //     setTeacher(data);
    //     console.log(teacher);
    // }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage('');

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = isDetail
                ? await axios.patch(`${API_BASE_URL}/academy/course-offers/${courseOfferId}/`, JSON.stringify(formData), config)
                : await axios.post(`${API_BASE_URL}/academy/course-offers/`, JSON.stringify(formData), config);

            setShowSuccessModal(true);
            resetData();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) =>
                        Array.isArray(errorArray)
                            ? errorArray.map((error) => `[${key}] ${error}`)
                            : typeof errorArray === 'object'
                                ? [`[${key}] ${Object.values(errorArray).join(' ')}`]
                                : [`[${key}] ${errorArray}`]
                    )
                    .join('\n');

                setAlertMessage(
                    errorMessages ? `Failed to submit data,\n${errorMessages}` : 'Failed to submit data. Please try again.'
                );
            } else {
                setAlertMessage('Failed to submit data. Please try again.');
            }
            console.error(error);
        }
    };

    const handleDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.delete(`${API_BASE_URL}/academy/course-offers/${courseOfferId}/`, config);
            handleAction();
        } catch (error) {
            setAlertMessage('Failed to remove course-offer. Please try again.');
            console.error(error);
        }
    };


    return (
        <div className="">

            <a className="icon-link icon-link-hover" href="#" onClick={handleBack}>
                <i className="bi bi-arrow-bar-left"></i> Goto List
            </a>

            <form className='mb-5' onSubmit={handleSubmit}>
                <h4 className='text-center m-5'>
                    <span className='badge bg-white text-secondary border p-2 fw-normal'>
                        Course Offer Form
                    </span>
                </h4>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Semester: </label>
                    <Select
                        options={semestermOptions}
                        isMulti={false}
                        value={selectedSemester}
                        menuPlacement="top"
                        placeholder='Open/Running Semesters'
                        onChange={handleSemesterChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Course: </label>
                    <Select
                        options={courseOptions}
                        isMulti={false}
                        value={selectedCourse}
                        menuPlacement="auto"
                        placeholder='Select a course'
                        onChange={handleCourseChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Teacher: </label>
                    <Select
                        options={teacherOptions}
                        isMulti={false}
                        value={selectedTeacher}
                        menuPlacement="auto"
                        placeholder='Select an enrolled teacher'
                        onChange={handleTeacherChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-4  mx-auto">
                    <div className="">
                        <label htmlFor='capacity' className="text-secondary py-1">Capacity: </label>
                        <div className="input-group rounded">
                            <input
                                className="form-control"
                                defaultChecked={formData.capacity}
                                onChange={(e) => handleCapacityChange(e)}
                                type="number"
                                id="capacity"
                                placeholder='Total student capacity'
                            />
                        </div>
                    </div>
                </div>

                {/* <div className="col-sm-12 col-md-8 my-4  mx-auto">
                    <div className="">
                        <label htmlFor='teacher' className="text-secondary py-1">Teacher: </label>
                        <div className="input-group rounded">
                            <input
                                className="form-control"
                                // value={teacher.user.username}
                                type="text"
                                id="teacher"
                                placeholder='Find an enrolled teacher'
                                value={teacherUsername}
                                onChange={(e) => setTeacherUsername(e.target.value)}
                            />
                            <button onClick={findTeacher} className='btn-beige rounded-end px-2' type='button'>Find Teacher</button>
                        </div>
                    </div>
                </div> */}


                <div className="col-sm-12 col-md-8 my-4  mx-auto">
                    {alertMessage && (
                        <div className={`alert alert-warning border border-secondary alert-dismissible fade show mt-3`} role="alert">
                            <strong>{alertMessage}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                        </div>
                    )}

                    <div className="btn-group gap-1 d-flex justify-content-equal mt-5 px-5">
                        <button className='btn btn-darkblue2 p-1 px-2' type='submit'><i className="bi bi-sd-card"> </i> Save </button>

                        {isDetail &&
                            <button className='btn btn-danger btn-sm p-1 px-2' onClick={() => setIsDelete(!isDelete)} type='button'><i className="bi bi-trash"> </i> Remove </button>
                        }
                    </div>


                    {isDelete &&
                        <div className="container d-flex align-items-center justify-content-center">
                            <div className="alert alert-warning border border-danger p-2 my-3" role="alert">
                                <h6 className='text-center me-2 d-inline'>Are  you sure?</h6>
                                <div className="btn-group text-center mx-auto" role="group" aria-label="Delete">
                                    <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                                    <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(false)}> No </button>
                                </div>
                            </div>
                        </div>}
                </div>
            </form>

            <button className="btn btn-sm border btn-dark d-flex mx-auto" onClick={resetData} type='button'> Reset </button>


            {showSuccessModal && (
                <div className="bg-blur">
                    <div className={`modal ${showSuccessModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-darkblue border border-beige text-beige">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-check-circle-fill"></i> Saved </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={() => { setShowSuccessModal(false), handleAction() }}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                    Saved successfully
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};





export default ManageCourseOffer;

