/**
 * Calling from: StudentActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getEnrollmentData, getProfileData } from '../../utils/auth.js';


const StudentCourseEnroll = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const studentProfile = getProfileData();
    const studentId = studentProfile.id;
    const enrollment = getEnrollmentData();
    const semester = enrollment.semester;
    const [showComponent, setShowComponent] = useState('CourseList');
    const [courses, setCourses] = useState([]);
    const [courseOffer, setCourseOffer] = useState('');
    const [courseOfferings, setCourseOfferings] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState('');


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('StudentCourseEnroll')}>
            <i className="bi-plus-square-fill"></i> Course Enrollment
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
            const response = await axios.get(`${API_BASE_URL}/academy/semester/${semester.id}/course_offers/`, config);
            setCourseOfferings(response.data);
        } catch (error) {
            setError(' Failed to fetch course  list.');
            console.error('Error fetching course list:', error);
        }
    };
    useEffect(() => {
        if (semester.is_open && enrollment.is_active && (courseOfferings.length < 1)) {
            fetchCourseOfferings();
        }
    }, []);



    const fetchEnrolledCourses = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/student/${studentId}/enrollments/`, config);
            const courseData = response.data;
            const courseDictionary = {};

            courseData.forEach(item => {
                const courseId = item.course_offer.course.id;
                courseDictionary[courseId] = item;
            });

            setEnrolledCourses(courseDictionary);

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


    const courseOfferView = (courseOffer) => {
        setCourseOffer(courseOffer);
        setShowComponent('CourseDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseOfferView={courseOfferView} courseOfferings={courseOfferings} />
            case 'CourseDetails':
                return <CourseDetails courseOffer={courseOffer} enrolledCourses={enrolledCourses} handleBack={handleBack} studentId={studentId} getPrerequisites={getPrerequisites} />
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
                <i className="bi-plus-square-fill"></i> Course Enrollment
            </h2>

            <div className="">
                {semester.is_open
                    ? <p className="text-center">Offered course(s) for <strong>{semester.term.name} {semester.year}</strong></p>
                    : <div className="d-flex justify-content-center">
                        <p className="text-center bg-danger text-white rounded p-2">Enrollment CLOSED for <strong>{semester.term.name} {semester.year}</strong></p>
                    </div>
                }
            </div>

            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            {enrollment.is_active
                ?
                <div className="">
                    {renderComponent()}
                </div>
                :
                <div className="text-center m-5 px-2 bg-warning p-3 rounded-3">
                    <h2 className='font-merriweather'>
                        <i className="bi-exclamation-triangle px-2"></i>
                        Restricted
                    </h2>
                    <small className='d-block'><i className="bi-info-circle"></i> Before you can enroll to a course, first you must be enrolled to a semester/program.</small>
                    <small className='d-block text-dark'>If you think this is a mistake, please contact a staff/support.</small>
                </div>
            }
        </>
    );
}


const CourseList = ({ courseOfferView, courseOfferings }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        setFilteredData(courseOfferings);
    }, [courseOfferings]);


    const handleCourseClick = (course) => {
        courseOfferView(course);
    };

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
            width: '20%',
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
            name: 'Prerequisites?',
            selector: (row) => `${row.course.prerequisites.length > 0 ? row.course.prerequisites.length : 'None'}`,
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

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = courseOfferings.filter(
            (cf) =>
                `${cf.semester.term.name} ${cf.semester.year}`.toLowerCase().includes(keyword) ||
                `${cf.teacher.teacher.user.first_name} ${cf.teacher.teacher.user.middle_name} ${cf.teacher.teacher.user.last_name} (${cf.teacher.teacher.acronym})`.toLowerCase().includes(keyword) ||
                `${cf.semester.term.start} to ${cf.semester.term.end}`.toLowerCase().includes(keyword) ||
                `${cf.course.acronym} ${cf.course.code}`.toLowerCase().includes(keyword) ||
                `Credit ${cf.course.credit}`.toLowerCase().includes(keyword) ||
                cf.course.name.toLowerCase().includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    return (
        <div>
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="Running">Running Courses</option>
                    <option value="Completed">Completed Courses</option>
                </select>
            </div>

            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

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


const CourseDetails = ({ courseOffer, enrolledCourses, handleBack, studentId, getPrerequisites }) => {
    const accessToken = getAccessToken();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollment, setEnrollment] = useState('');
    const [enrollmentChecked, setEnrollmentChecked] = useState(false);
    const [enrollmentMessage, setEnrollmentMessage] = useState('');
    const {
        id,
        semester,
        course,
        teacher,
        capacity
    } = courseOffer;

    const prerequisites = getPrerequisites(course.prerequisites);

    const checkIfEnrolled = () => {

        const apiEndpoint = `${API_BASE_URL}/academy/course/is-enrolled/${courseOffer.id}/${studentId}/`;

        // Making the GET request
        axios.get(apiEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // set response
                setIsEnrolled(response.data.is_enrolled);
                if(response.data.enrollment) {
                    setEnrollment(response.data.enrollment)
                }
                setEnrollmentChecked(true);
            })
            .catch(error => {
                setEnrollmentChecked(false);
                console.error('Error Checking Is Enrolled:', error);
            });
    };
    useEffect(() => {
        checkIfEnrolled();
    }, []);


    const handleEnrollment = () => {
        const enrollmentData = {
            course_offer: courseOffer.id,
            student: studentId,
            is_complete: false,
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
                setEnrollmentMessage('Successfully enrolled.')
                setIsEnrolled(true);
                setEnrollment(response.data);
            })
            .catch(error => {
                setEnrollmentMessage('FAILED: An error occurred while enrolling :(')
                console.error('Error creating enrollment:', error);
            });
    };

    
    const handleDisenrollment = () => {
        const apiEndpoint = `${API_BASE_URL}/academy/course-enrollment/${enrollment.id}/`;

        // Making the POST request
        axios.delete(apiEndpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setEnrollmentMessage('Successfully disenrolled.')
                setIsEnrolled(false);
            })
            .catch(error => {
                setEnrollmentMessage('FAILED: An error occurred while disenrolling :(')
                console.error('Error creating disenrollment:', error);
            });
    };


    const checkPrerequisite = (courseId) => {
        if (enrolledCourses.hasOwnProperty(courseId)) {
            // Check if the course is marked as complete (is_complete is true)
            // if (enrolledCourses[courseId].is_complete === true) {
            //     return true; // Return true if found and is_complete is true
            // }

            // in case, prerequisite completion is required, remove comment from above condition 
            // for now, return true if student is just enrolled to the prerequisite course.
            return true;
        }
        return false; 
    }


    return (
        <div className="mt-4 font-merriweather">

            {/* Go batck to course list  */}
            <a className="icon-link icon-link-hover mb-2" href="#" onClick={handleBack}>
                <small><i className="bi bi-arrow-bar-left"></i> Goto List</small>
            </a>

            {/* Course Info  */}
            <div className="course-border-beige content-sm-85">
                <div className="">
                    <h4 className="text-center fw-bolder">{course.name}</h4>
                    <nav className="nav m-3 d-flex justify-content-center mx-sm-0">
                        <span className="nav-link border text-center bg-white m-1 rounded-start">
                            <span className='d-block text-darkblue fw-bold border-bottom'>{course.acronym}</span>
                            <span className='d-block text-darkblue fw-bold'>{course.code}</span>
                        </span>
                        <span className="nav-link border text-center bg-white m-1">
                            <span className='d-block text-darkblue fw-light border-bottom'>Credit</span>
                            <span className='d-block text-darkblue fw-bold'>{course.credit}</span>
                        </span>
                        <span className="nav-link border text-center bg-white m-1 rounded-end">
                            <span className='d-block text-darkblue fw-light border-bottom'>Seats</span>
                            <span className='d-block text-darkblue fw-bold'>{capacity}</span>
                        </span>
                    </nav>
                </div>
            </div>

            {/* Teacher Info  */}
            <div className="my-5">
                <div className="border-4 border-start rounded-4 py-2 px-4">
                    <div className='my-2'><strong className='border-3 py-1 border-bottom'>Teacher</strong></div>

                    {/* Name:  */}
                    <p className='m-0 mt-2'>{teacher.teacher.user.first_name} {teacher.teacher.user.middle_name} {teacher.teacher.user.last_name} ({teacher.teacher.acronym})</p>

                    {/* Designation(s): */}
                    {teacher.designations.map((designation) => (
                        <div key={designation.id}>
                            <small className='d-inline-block text-secondary fw-normal m-0 px-2'>{designation.name}</small>
                        </div>
                    ))}

                    {/* Department(s): */}
                    {teacher.departments.map((department) => (
                        <div key={department.id}>
                            <small className='d-inline-block text-secondary fw-normal m-0 px-2'>{department.name} ({department.acronym} {department.code})</small>
                        </div>
                    ))}

                    {/* Phone: */}
                    <small className='d-block text-secondary fw-normal m-0 px-2'>{teacher.teacher.phone}</small>

                    {/* Email: */}
                    <small className='d-block text-secondary fw-normal m-0 px-2'>{teacher.teacher.user.email}</small>

                </div>
            </div>

            {/* Prerequisites Info  */}
            <div className="my-5">
                <div className="border-4 border-start rounded-4 py-2 px-4">
                    <div className='my-2'><strong className='border-3 py-1 border-bottom'>Prerequisites</strong></div>

                    {/* In case there is no prerequisites */}
                    {(course.prerequisites.length < 1) && <>
                        <small className='d-inline-block text-secondary fw-normal m-0 px-2'>None</small>
                    </>}

                    {(course.prerequisites.length > 0) && <div>
                        {prerequisites.map((course) => (
                            <div key={course.id}>
                                <small className='d-inline-block text-secondary fw-normal m-0 px-2'>
                                    {(checkPrerequisite(course.id))
                                        ? <i className="bi bi-check-circle"> </i>
                                        : <i className="bi bi-x-circle fw-bold text-danger"> </i>}
                                    {course.name} ({course.acronym} {course.code})
                                </small>
                            </div>
                        ))}
                    </div>}

                </div>
            </div>

            <div className="my-4 d-flex justify-content-center text-secondary">
                {!enrollmentChecked && <>
                    <small className=''>
                        <i className="bi bi-exclamation-triangle"> Couldn't check enrollment status.</i>
                    </small>
                    <button className='btn btn-sm btn-light p-0 px-1 mx-2' onClick={() => { checkIfEnrolled() }}>
                        <small><i className="bi bi-arrow-clockwise"> Retry</i></small>
                    </button>
                </>}
            </div>

            {enrollmentMessage && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong> {enrollmentMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setEnrollmentMessage('')}></button>
                </div>
            )}

            <div className="my-4 d-flex justify-content-center">
                {isEnrolled
                    ? <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-darkblue2 pt-1" disabled>Enrolled</button>
                        <button 
                        type="button" 
                        className="btn btn-darkblue2 pt-1"
                        onClick={() => { handleDisenrollment() }}
                        >
                            Disenroll
                            </button>
                    </div>
                    : <div className="btn-group gap-2" role="group" aria-label="Basic example">
                        <button
                            type="button"
                            className="btn btn-darkblue2 pt-1"
                            disabled={!enrollmentChecked}
                            onClick={() => { handleEnrollment() }}
                        >
                            Enroll
                        </button>
                    </div>
                }
            </div>

        </div>
    );
};



export default StudentCourseEnroll;

