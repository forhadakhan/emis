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

import CourseDetails from './course-control/CourseDetails.jsx'



// Main Component 
const ManageCourseOffer = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [alertMessage, setAlertMessage] = useState('');
    const [showComponent, setShowComponent] = useState('CourseOfferList');
    const [semesters, setSemesters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courseOffer, setCourseOffer] = useState('');

    // add current component to breadcrumb
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
        const fetchCourses = async () => {
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

        if (courses.length === 0) {
            fetchCourses();
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

    // // get an enrolled teacher by id/username 
    // const getTeacher = async (id = null, username = '') => {
    //     try {
    //         const response = await axios.get(`${API_BASE_URL}/academy/get-enrolled-teacher/`, {
    //             params: {
    //                 user_id: id,
    //                 username: username,
    //             },
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });

    //         return response.data;
    //     } catch (error) {
    //         return error;
    //         console.error(error);
    //     }
    // };

    const courseOfferView = (courseOffer) => {
        setCourseOffer(courseOffer);
        setShowComponent('CourseOfferDetail')
    }

    const handleBack = async () => {
        setShowComponent('CourseOfferList');
    };

    const hasPrerequisites = (prerequisites) => {
        if (prerequisites.length < 1) return 'None';

        // Filter courses based on prerequisites
        const filteredCourses = courses.filter(course => prerequisites.includes(course.id));

        // Retrieve acronym and code for each course and join them by comma
        const prerequisitesStr = filteredCourses.map(course => `${course.acronym} ${course.code}`).join(', ');

        return prerequisitesStr;
    }

    const prerequisiteStatus = (prerequisites) => {
        return (prerequisites.length > 0) ? 'hasPrerequisites' : 'hasNoPrerequisites';
    }


    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseOfferList':
                return <CourseOfferList hasPrerequisites={hasPrerequisites} prerequisiteStatus={prerequisiteStatus} courseOfferView={courseOfferView} />;
            case 'AddCourseOffer':
                return <AddCourseOffer hasPrerequisites={hasPrerequisites} teachers={teachers} semesters={semesters} courses={courses} handleBack={handleBack} />;
            case 'CourseOfferDetail':
                return <CourseOfferDetail hasPrerequisites={hasPrerequisites} teachers={teachers} semesters={semesters} courses={courses} handleBack={handleBack} courseOffer={courseOffer} />;
            default:
                return <CourseOfferList hasPrerequisites={hasPrerequisites} prerequisiteStatus={prerequisiteStatus} courseOfferView={courseOfferView} />;
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



// Sub-component to ManageCourseOffer 
const CourseOfferList = ({ hasPrerequisites, prerequisiteStatus, courseOfferView }) => {
    const accessToken = getAccessToken();
    const [courseOfferings, setCourseOfferings] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    // get all existing course offerings through api 
    const fetchCourseOfferings = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/course-offers/`, config);
            setCourseOfferings(response.data);
        } catch (error) {
            setError(' Failed to fetch course offer list.');
            console.error('Error fetching course offerings:', error);
        }
    };
    useEffect(() => {
        fetchCourseOfferings();
    }, []);


    // Filtered data used for searching feature, initially set all courses to filteredData 
    useEffect(() => {
        setFilteredData(courseOfferings);
    }, [courseOfferings]);


    // show details when a course offering is selected 
    const handleCourseClick = (course) => {
        courseOfferView(course);
    };


    // get teacher designations and departments 
    const getTeacherEnrollment = (data) => {
        const teacherDesignations = data.teacher.designations.map(designation => designation.name).join(', ');
        const teacherDepartments = data.teacher.departments.map(department => department.acronym).join(', ');
        return `${teacherDesignations} (${teacherDepartments})`
    }


    // set course offer list or datatable column data 
    const columns = [
        {
            name: 'Semester',
            selector: (row) => `${row.semester.term.name} ${row.semester.year}`,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.semester.term.name} {row.semester.year}</strong>
                    <small>{row.semester.term.start} to {row.semester.term.end}</small>
                </div>
            ),
            width: '16%',
        },
        {
            name: 'Course',
            selector: (row) => row.course.name,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.course.name}</strong>
                    <small>{row.course.acronym} {row.course.code}: Credit {row.course.credit}</small>
                </div>
            ),
        },
        {
            name: 'Teacher',
            selector: (row) => `${row.teacher.teacher.user.first_name} ${row.teacher.teacher.user.middle_name} ${row.teacher.teacher.user.last_name}  (${row.teacher.teacher.acronym}) `,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.teacher.teacher.user.first_name} {row.teacher.teacher.user.middle_name} {row.teacher.teacher.user.last_name}  ({row.teacher.teacher.acronym})</strong>
                    <small>{getTeacherEnrollment(row)}</small>
                </div>
            ),
        },
        {
            name: 'Prerequisites',
            selector: (row) => hasPrerequisites(row.course.prerequisites),
            sortable: true,
            width: '15%',
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleCourseClick(row)}
                >
                    Details
                </button>
            ),
        },
    ];

    // define offer list or datatable column styles  
    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
            },
        },
    };


    const getSemesterStatus = (semester) => {
        return semester.is_finished ? "Semester Finished" : "Semester Not Finished";
    }

    // handle course offer search 
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = courseOfferings.filter(
            (cf) =>
                prerequisiteStatus(cf.course.prerequisites).toLowerCase().includes(keyword) ||
                `${cf.semester.term.name} ${cf.semester.year}`.toLowerCase().includes(keyword) ||
                `${cf.teacher.teacher.user.first_name} ${cf.teacher.teacher.user.middle_name} ${cf.teacher.teacher.user.last_name} (${cf.teacher.teacher.acronym})`.toLowerCase().includes(keyword) ||
                `${cf.semester.term.start} to ${cf.semester.term.end}`.toLowerCase().includes(keyword) ||
                `${cf.course.acronym} ${cf.course.code}`.toLowerCase().includes(keyword) ||
                `Credit ${cf.course.credit}`.toLowerCase().includes(keyword) ||
                cf.course.name.toLowerCase().includes(keyword) ||
                getSemesterStatus(cf.semester).toLowerCase().includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    return (
        <div>
            {/* show api request error response  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}


            {/* course offerings filter options   */}
            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="hasPrerequisites">Has Prerequisites</option>
                    <option value="hasNoPrerequisites">No Prerequisites</option>
                    <option value="Semester Not Finished">Running Semesters</option>
                    <option value="Semester Finished">Finished Semesters</option>
                    <option value="Lab">Lab Courses</option>
                </select>
            </div>

            {/* search input field  */}
            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            {/* show course offers list using Datatable  */}
            <div className="rounded-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    highlightOnHover
                />
            </div>
        </div>
    );
};



// Sub-component to ManageCourseOffer
const CourseOfferDetail = ({ teachers, semesters, hasPrerequisites, courses, handleBack, courseOffer }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('CourseOfferForm');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');



    const fetchEnrolledStudents = () => {
        setError('');

        axios.get(`${API_BASE_URL}/academy/course_offer/${courseOffer.id}/students/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                setError("Error fetching enrolled students");
                console.error('Error fetching enrolled students:', error);
            });
    };
    // Fetch enrolled students when the component mounts
    useEffect(() => {
        fetchEnrolledStudents();
    }, []);


    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseOfferForm':
                return <CourseOfferForm teachers={teachers} semesters={semesters} courses={courses} hasPrerequisites={hasPrerequisites} courseOfferView={courseOffer} handleBack={handleBack} />
            case 'CourseDetails':
                return <CourseDetails courseOffer={courseOffer} handleBack={handleBack} />
            case 'EnrollStudent':
                return <EnrollStudent courseOffer={courseOffer} />
            default:
                return <></>
        }
    }

    return (<>

        {/* show error message if any  */}
        {error && (
            <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <i className="bi bi-x-octagon-fill"> </i>
                <strong> {error} </strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
            </div>
        )}


        {/* action buttons */}
        <div className="my-4 d-flex justify-content-center font-merriweather">
            <div className="btn-group gap-2" role="group">
                <button
                    type="button"
                    className="btn btn-darkblue2 pt-1"
                    onClick={() => { setShowComponent('CourseOfferForm') }}
                    disabled={showComponent === 'CourseOfferForm'}
                > Update Info
                </button>
                <button
                    type="button"
                    className="btn btn-darkblue2 pt-1"
                    onClick={() => { setShowComponent('CourseDetails') }}
                    disabled={showComponent === 'CourseDetails'}
                > Course Details
                </button>
                <button
                    type="button"
                    className="btn btn-darkblue2 pt-1"
                    onClick={() => { setShowComponent('EnrollStudent') }}
                    disabled={showComponent === 'EnrollStudent'}
                > Enroll a student
                </button>
            </div>
        </div>

        {/* render selected component  */}
        <div>
            {renderComponent()}
        </div>

    </>);
}


// Sub-component to CourseOfferDetail
const EnrollStudent = ({ courseOffer }) => {
    /** 
     * enroll a student in the selected course offer
     */
    const accessToken = getAccessToken();
    const [message, setMessage] = useState('');
    const [student, setStudent] = useState('');
    const [username, setUsername] = useState('');
    const [isRetake, setIsRetake] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    // get the selected student 
    const fetchTheStudent = () => {
        setMessage('');

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const url = `${API_BASE_URL}/student/id/${username}`;

        // Make the API request to get the student 
        axios.get(url, config)
            .then(response => {
                setStudent(response.data);
                console.log(response.data);

            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    setMessage(error.response.data.detail);
                } else {
                    setMessage('An error occurred while retrieving the student.');
                    console.error(error);
                }
            });
    };

    const handleFindUser = (e) => {
        e.preventDefault();
        fetchTheStudent();
    }


    // enroll (new/retake) to selected course offer 
    const handleEnrollment = (regular) => {
        const enrollmentData = {
            course_offer: courseOffer.id,
            student: student.id,
            is_complete: false,
            regular: regular,
        };

        const apiEndpoint = `${API_BASE_URL}/academy/course-enrollment/`;

        // Making the POST request
        axios.post(apiEndpoint, enrollmentData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // console.log('Course enrollment successful.:', response.data);
                setMessage('Successfully enrolled.')
                setIsEnrolled(true);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorMessages = Object.entries(error.response.data)
                        .flatMap(([key, errorArray]) => {
                            if (Array.isArray(errorArray)) {
                                const e = errorArray.map(error => `${error}`);
                                if (e[0] === "The fields course_offer, student must make a unique set.") {
                                    return 'Already enrolled';
                                } else if (e[0] === "Student already enrolled in this course as 'regular course'.") {
                                    setIsRetake(true);
                                    return `Student has taken this course before as 'regular course'.`;
                                } return e;
                            } else if (typeof errorArray === 'object') {
                                const errorMessage = Object.values(errorArray).join(' ');
                                return [`[${key}] ${errorMessage}`];
                            } else {
                                return [`[${key}] ${errorArray}`];
                            }
                        })
                        .join('\n');

                    if (errorMessages) {
                        setMessage(`${errorMessages}`);
                    } else {
                        setMessage('FAILED: An error occurred while enrolling :(');
                    }
                } else {
                    setMessage('FAILED: An error occurred while enrolling :(');
                }
                console.error('Error creating enrollment:', error);
            });
    };

    return (<>

        {/* form to find a student */}
        <div>
            <form onSubmit={handleFindUser}>
                <div className="mb-3 my-5 mx-md-5">
                    <label htmlFor="usernameInput" className="form-label"><i className="bi bi-input-cursor-text"></i> Enter ID/username</label>
                    <input
                        className="form-control border border-darkblue text-center"
                        type="text"
                        placeholder="Enter the student id/username."
                        aria-label="usernameInput"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3 m-3 d-flex">
                    <button className="btn btn-darkblue mx-auto pt-1" disabled={username.length < 1} type='submit'>
                        <span><i className="bi bi-search"></i></span>  Find
                    </button>
                </div>
            </form>
        </div>

        {/* show message if any  */}
        {message &&
            <div className="alert alert-info alert-dismissible fade show border border-darkblue mx-md-5" role="alert">
                <strong> {message} </strong>
                <button type="button" onClick={() => setMessage('')} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}


        {/* if there student data, show some info about the student with enrollment button */}
        {student && <>
            <div className="col-sm-12 col-md-8 mx-auto my-5">
                <div className="row g-0">
                    <div className="col-md-3">
                        <div className={`rounded-2 mx-auto ${student.photo_id ? '' : 'bg-darkblue'} text-beige`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }}>
                            {student.photo_id ? (
                                <img src={getFileLink(student.photo_id)} className="img-fluid rounded mx-auto d-flex border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }} alt="..." />
                            ) : (
                                <i className="bi bi-person-bounding-box fs-1"></i>
                            )}
                        </div>
                    </div>
                    <div className="col-md-9 p-3">
                        <div className="ms-5">
                            {student.user && <>
                                <h4 className="">{`${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}`}</h4>
                                <h5 className="fs-6 text-body-secondary">ID: {student.user.username}</h5>
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-envelope-fill"></i> {student.user.email}</h5>
                            </>}
                            <h5 className="fs-6 text-body-secondary"><i className="bi bi-telephone-fill"></i> {student.phone}</h5>
                        </div>

                        <button
                            className='btn btn-success pt-1 fw-bold m-3 ms-5 '
                            onClick={() => { handleEnrollment(true) }}
                        > Enroll this student
                        </button>
                        {isRetake &&
                            <button
                                className='btn btn-success pt-1 fw-bold m-3 ms-5 '
                                onClick={() => { handleEnrollment(false) }}
                            > Enroll as retake
                            </button>
                        }
                    </div>
                </div>
            </div>
        </>}

    </>);
}



// Sub-component to ManageCourseOffer 
const AddCourseOffer = ({ semesters, courses, teachers, hasPrerequisites, getTeacher, handleBack }) => {
    return (
        <CourseOfferForm teachers={teachers} semesters={semesters} courses={courses} hasPrerequisites={hasPrerequisites} getTeacher={getTeacher} handleBack={handleBack} />
    );
}



// Sub-component to CourseOfferDetail and AddCourseOffer 
const CourseOfferForm = ({ semesters, hasPrerequisites, courses, courseOfferView = {}, teachers, handleBack }) => {
    const accessToken = getAccessToken();
    const initForm = {
        semester: '',
        course: '',
        teacher: '',
        capacity: '',
    }
    const [alertMessage, setAlertMessage] = useState('');
    const [courseOffer, setCourseOffer] = useState(courseOfferView);
    const courseOfferId = courseOfferView.id;
    const [isDetail, setIsDetail] = useState(Object.entries(courseOffer).length !== 0);
    const [isDelete, setIsDelete] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showTeacherDetail, setShowTeacherDetail] = useState(false);
    const [showPrerequisites, setShowPrerequisites] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [capacity, setCapacity] = useState('');


    // get all existing course offerings through api 
    const fetchCourseOffer = async (courseOfferId) => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/course-offers/${courseOfferId}`, config);
            setCourseOffer(response.data);

        } catch (error) {
            setError(' Failed to fetch course offer list.');
            console.error('Error fetching course offerings:', error);
        }
    };
    useEffect(() => {
        fetchCourseOffer(courseOfferId);
    }, [isDetail])


    // set course options data for select (pkg: react-select)
    const courseOptions = courses.map(course => ({
        value: course.id,
        label: `${course.code}: ${course.name}`
    }));


    // set semester options data for select (pkg: react-select)
    const semestermOptions = semesters.map(semester => ({
        value: semester.id,
        isDisabled: !semester.is_open,
        label: `${semester.term.name} ${semester.year} (${semester.term.start} to ${semester.term.end})`
    }));


    // set teacher options data for select (pkg: react-select)
    const teacherOptions = teachers.map(enrollment => ({
        value: enrollment.teacher.id,
        label: `${enrollment.teacher.user.first_name} ${enrollment.teacher.user.middle_name} ${enrollment.teacher.user.last_name} (${enrollment.teacher.acronym})`
    }));

    // in case we are viewing an existing course offerings, set the present data to formData
    const setPresentData = () => {
        const data = {
            semester: courseOffer.semester.id,
            course: courseOffer.course.id,
            teacher: courseOffer.teacher.teacher.id,
            capacity: courseOffer.capacity,
        }
        setFormData(data)
        const course = courses.find((course) => course.id === data.course);
        const semester = semesters.find((semester) => semester.id === data.semester);
        // enrolled teacher 
        const enrollment = teachers.find((enrollment) => enrollment.id === courseOffer.teacher.id);
        setCapacity(data.capacity);
        setSelectedCourse({ isDisabled: true, value: course.id, label: `${course.code}: ${course.name}` });
        setSelectedTeacher({ isDisabled: true, value: enrollment.teacher.id, label: `${enrollment.teacher.user.first_name} ${enrollment.teacher.user.middle_name} ${enrollment.teacher.user.last_name} (${enrollment.teacher.acronym})` });
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
    }, [courseOffer])


    const resetData = () => {
        if (isDetail) {
            setPresentData();
        } else {
            setIsDetail(false);
            setAlertMessage('');
            setSelectedSemester('');
            setSelectedCourse('');
            setSelectedTeacher('');
            setCapacity('');
        }
    }


    // get teacher name, designations, and departments in an object 
    const teacherDetail = (selectedTeacher) => {
        // enrolled teacher data
        const enrollment = teachers.find((enrollment) => enrollment.teacher.id === selectedTeacher.value);
        if (!enrollment) return;
        const teacherDesignations = enrollment.designations.map(designation => designation.name).join(', ');
        const teacherDepartments = enrollment.departments.map(department => department.acronym).join(', ');
        const data = {
            name: `${enrollment.teacher.user.first_name} ${enrollment.teacher.user.middle_name} ${enrollment.teacher.user.last_name} (${enrollment.teacher.acronym})`,
            designations: teacherDesignations,
            departments: teacherDepartments,
        }
        return data;
    }

    // get teacher name, designations, and departments in a div 
    const getTeacherDetail = (selectedTeacher) => {
        if (!selectedTeacher) return;
        const data = teacherDetail(selectedTeacher);
        if (!data) return;
        return <>
            <div className="border-3 m-3 p-3 bg-white border-start">
                <small className='d-block'>{data.name}</small>
                <small className='d-block'>{data.designations}</small>
                <small className='d-block'>{data.departments}</small>
            </div>
        </>;
    }


    // get prerequisites data in a div  
    const getPrerequisites = (selectedCourse) => {
        if (!selectedCourse) return;
        const course = courses.find((course) => course.id === selectedCourse.value)
        const data = hasPrerequisites(course.prerequisites);
        if (!data) return;
        return <>
            <div className="border-3 m-3 p-3 bg-white border-start">
                <small className='d-block text-secondary'>Prerequisites:</small>
                <small className='d-block'>{data}</small>
            </div>
        </>;
    }


    // handle a semester select 
    const handleSemesterChange = (selectedOption) => {
        setSelectedSemester(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, semester: parseInt(selectedOption.value) });
        }
    };


    // handle a semester select 
    const handleCourseChange = (selectedOption) => {
        setSelectedCourse(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, course: parseInt(selectedOption.value) });
        }
    }


    // handle a teacher select 
    const handleTeacherChange = (selectedOption) => {
        setSelectedTeacher(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, teacher: parseInt(selectedOption.value) });
        }
    }


    // handle capacity input 
    const handleCapacityChange = (e) => {
        setCapacity(e.target.value)
        setFormData({ ...formData, capacity: e.target.value });
    }


    // submit data through api to add/modify a course offer 
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
            // if we are viewing details, set updated data to courseOffer, otherwise reset formData to initial 
            isDetail ? fetchCourseOffer(courseOfferId) : setFormData(initForm);

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


    // send request through api to delete a course offer from the system 
    const handleDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.delete(`${API_BASE_URL}/academy/course-offers/${courseOfferId}/`, config);
            handleBack();
        } catch (error) {
            setAlertMessage('Failed to remove course-offer. Please try again.');
            console.error(error);
        }
    };


    const handleModalClose = () => {
        setShowSuccessModal(false)
    }


    return (
        <div className="">

            {/* course offer list link  */}
            <a className="icon-link icon-link-hover" href="#" onClick={handleBack}>
                <small>
                    <i className="bi bi-arrow-bar-left"></i> Goto List
                </small>
            </a>


            {/* course offer form  */}
            <form className='mb-5' onSubmit={handleSubmit}>
                <h4 className='text-center m-5'>
                    <span className='badge bg-white text-secondary border p-2 fw-normal'>
                        Course Offer Form
                    </span>
                    <button
                        type='button'
                        className='btn btn-light mx-2'
                        data-bs-toggle="tooltip"
                        title="Reload Data"
                        onClick={() => fetchCourseOffer(courseOfferId)}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>

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
                    <a className='btn text-secondary border-0' onClick={() => setShowPrerequisites(!showPrerequisites)}><i className="bi bi-info-circle" type='button'></i></a>
                    {showPrerequisites && getPrerequisites(selectedCourse)}
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
                    <a className='btn text-secondary border-0' onClick={() => setShowTeacherDetail(!showTeacherDetail)}><i className="bi bi-info-circle" type='button'></i></a>
                    {showTeacherDetail && getTeacherDetail(selectedTeacher)}
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
                                value={capacity}
                                onChange={(e) => handleCapacityChange(e)}
                                type="number"
                                id="capacity"
                                name='capacity'
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


            {/* reset form button  */}
            <button className="btn btn-sm border btn-dark d-flex mx-auto" onClick={resetData} type='button'> Reset </button>


            {/* if submission was successful, let the user know  */}
            {showSuccessModal && (
                <div className="bg-blur">
                    <div className={`modal ${showSuccessModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-darkblue border border-beige text-beige">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-check-circle-fill"></i> Saved </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleModalClose}>
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

