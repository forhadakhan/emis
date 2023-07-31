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
    const [error, setError] = useState('');


    // add current component to breadcrumb 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('StudentCourseEnroll')}>
            <i className="bi-plus-square-fill"></i> Course Enrollment
        </button>
    );


    // get all coffered courses for students enrolled semester 
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


    // return courses based on ids, using to get Prerequisite courses 
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


    // go back to the list 
    const handleBack = async () => {
        setShowComponent('CourseList');
    };


    // show details for the selected course from the list 
    const courseOfferView = (courseOffer) => {
        setCourseOffer(courseOffer);
        setShowComponent('CourseDetails');
    }


    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseOfferView={courseOfferView} courseOfferings={courseOfferings} />
            case 'CourseDetails':
                return <CourseDetails courseOffer={courseOffer} handleBack={handleBack} studentId={studentId} getPrerequisites={getPrerequisites} />
            default:
                return <CourseList courseOfferView={courseOfferView} courseOfferings={courseOfferings} />
        }
    }


    return (
        <>
            <div className="">
                {/* breadcrumb section  */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>

            </div>

            {/* page title */}
            <h2 className="text-center m-5 px-2 font-merriweather">
                <i className="bi-plus-square-fill"></i> Course Enrollment
            </h2>

            {/* let the user know if enrollment is open or not */}
            <div className="">
                {semester.is_open
                    ? <p className="text-center">Offered course(s) for <strong className='bg-beige p-1 rounded px-2'>{semester.term.name} {semester.year}</strong></p>
                    : <div className="d-flex justify-content-center">
                        <p className="text-center bg-danger text-white rounded p-2">Enrollment CLOSED for <strong>{semester.term.name} {semester.year}</strong></p>
                    </div>
                }
            </div>

            {/* display the error (if any)  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            {/* if the student's enrollement is not active, show a restricted message. Else, render couser offer list/detail component  */}
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


    // filteredData is being used for searching, initially set all data as filtered 
    useEffect(() => {
        setFilteredData(courseOfferings);
    }, [courseOfferings]);


    // handle course select 
    const handleCourseClick = (course) => {
        courseOfferView(course);
    };


    // define list columns 
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
                    <small> (Teacher: {row.teacher.teacher.acronym}) </small>
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

    // define table styles 
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


    // handle search input results 
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = courseOfferings.filter(
            (cf) =>
                `${cf.course.prerequisites.length > 0 ? 'Have Prerequisites' : 'Prerequisites None'}`.toLowerCase().includes(keyword) ||
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

            {/* show error, if there any  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            {/* filter options  */}
            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="" className='text-white'>No Filter</option>
                    <option value="Have Prerequisites"> Have Prerequisites </option>
                    <option value="Prerequisites None"> No Prerequisites </option>
                </select>
            </div>

            {/* take search input  */}
            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            {/* show course offers list  */}
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


const CourseDetails = ({ courseOffer, handleBack, studentId, getPrerequisites }) => {
    const accessToken = getAccessToken();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isRetake, setIsRetake] = useState(false);
    const [isDisenroll, setIsDisenroll] = useState(false);
    const [takenBefore, setTakenBefore] = useState(false);
    const [prerequisitesCleared, setPrerequisitesCleared] = useState(true);
    const [enrollment, setEnrollment] = useState('');
    const [prerequisites, setPrerequisites] = useState([]);
    const [prevEnrollments, setPrevEnrollments] = useState([]);
    const [enrollmentChecked, setEnrollmentChecked] = useState(false);
    const [enrollmentMessage, setEnrollmentMessage] = useState('');
    const {
        id,
        semester,
        course,
        teacher,
        capacity
    } = courseOffer;


    // get prerequisite courses 
    useEffect(() => {
        const prerequisites = getPrerequisites(course.prerequisites);
        setPrerequisites(prerequisites);
    }, [course.prerequisites]);


    // check and set Prerequisites Cleared status 
    useEffect(() => {
        prerequisites.forEach(course => {
            const status = enrolledCourses.hasOwnProperty(course.id);

            // in case, prerequisite completion is required, remove comment from below code  
            // if (status && (enrolledCourses[course.id].is_complete === true)) {
            //     return; // Return if course is not completed yet.
            // } else {
            //     setPrerequisitesCleared(false);
            // }

            if (!status) {
                setPrerequisitesCleared(false);
            }
        });
    }, [prerequisites]);


    // get all enrolled courses for the logged student 
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


    // check if the student have taken the selected course before 
    const checkIfPreviouslyEnrolled = () => {

        const apiEndpoint = `${API_BASE_URL}/academy/course/check-enrollments/${courseOffer.course.id}/${studentId}/`;

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
                setPrevEnrollments(response.data.enrollments)
                setEnrollmentChecked(true);
            })
            .catch(error => {
                setEnrollmentChecked(false);
                console.error('Error Checking Is Enrolled:', error);
            });

        const previouslyEnrolled = enrolledCourses.hasOwnProperty(courseOffer.course.id);
        setTakenBefore(previouslyEnrolled);
    };
    useEffect(() => {
        checkIfPreviouslyEnrolled();
    }, []);


    // setup button dependencies based on prevEnrollments
    const setButtonDependencies = () => {
        if (!Array.isArray(prevEnrollments)) {
            // console.error("prevEnrollments is not an array.");
            // console.log(prevEnrollments)
            return;
        }

        // check if already enrolled in selected course offer  
        const enrollment = prevEnrollments.find(
            (enrollment) => enrollment.course_offer.id === courseOffer.id
        );

        // if already enrolled in selected course offer, trigger disenrollment and set enrollment  
        const disenroll = !!enrollment;
        setIsDisenroll(disenroll);
        if (disenroll) { setEnrollment(enrollment) }

        // in case not enrolled in selected course offer, check if previously taken 
        if (!disenroll) {
            const retake = prevEnrollments.some(
                (enrollment) => enrollment.course_offer.course.id === courseOffer.course.id
            );
            setIsRetake(retake);
        }
    }
    useEffect(() => {
        setButtonDependencies()
    }, [prevEnrollments])


    // enroll (new/retake) to selected course offer 
    const handleEnrollment = () => {
        const enrollmentData = {
            course_offer: courseOffer.id,
            student: studentId,
            is_complete: false,
            regular: !isRetake,
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
                setIsDisenroll(true);
                setIsRetake(false);
                setEnrollment(response.data);
            })
            .catch(error => {
                if (error.response && error.response.data) {
                    const errorMessages = Object.entries(error.response.data)
                        .flatMap(([key, errorArray]) => {
                            if (Array.isArray(errorArray)) {
                                return errorArray.map(error => `${error}`);
                            } else if (typeof errorArray === 'object') {
                                const errorMessage = Object.values(errorArray).join(' ');
                                return [`[${key}] ${errorMessage}`];
                            } else {
                                return [`[${key}] ${errorArray}`];
                            }
                        })
                        .join('\n');

                    if (errorMessages) {
                        setEnrollmentMessage(`${errorMessages}`);
                    } else {
                        setEnrollmentMessage('FAILED: An error occurred while enrolling :(');
                    }
                } else {
                    setEnrollmentMessage('FAILED: An error occurred while enrolling :(');
                }
                console.error('Error creating enrollment:', error);
            });
    };


    // disenroll from current course offer 
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
                setIsDisenroll(false);
                setIsRetake(false);
            })
            .catch(error => {
                setEnrollmentMessage('FAILED: An error occurred while disenrolling :(')
                console.error('Error creating disenrollment:', error);
            });
    };


    // check if the student met the prerequisite(s)
    const checkPrerequisite = (courseId) => {
        const status = enrolledCourses.hasOwnProperty(courseId);

        if (status) {
            // Check if the course is marked as complete (is_complete is true)
            // if (enrolledCourses[courseId].is_complete === true) {
            //     return true; // Return true if found and is_complete is true
            // } else {
            //     return false;
            // }

            // in case, prerequisite completion is required, remove comment from above condition 
            // for now, return true if student is just enrolled to the prerequisite course.
            return true;
        } else {
            return false;
        }

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

                    {/* In case there is prerequisites */}
                    {(course.prerequisites.length > 0) && <div>
                        {prerequisites.map((course) => (
                            <div key={course.id}>
                                {console.log(course)}
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
                {/* show message with retry button if enrollment status check failed */}
                {!enrollmentChecked && <>
                    <small className=''>
                        <i className="bi bi-exclamation-triangle"> Couldn't check enrollment status.</i>
                    </small>
                    <button className='btn btn-sm btn-light p-0 px-1 mx-2' onClick={() => { checkIfPreviouslyEnrolled() }}>
                        <small><i className="bi bi-arrow-clockwise"> Retry</i></small>
                    </button>
                </>}
            </div>

            {/* enrollment request response message  */}
            {enrollmentMessage && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong> {enrollmentMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setEnrollmentMessage('')}></button>
                </div>
            )}

            {/* if prerequisites is not cleared, let the user know  */}
            {!prerequisitesCleared && <>
                <p className='small text-center'><i className="bi bi-exclamation-triangle px-2"></i> Prerequisite(s) not cleared. </p>
            </>}

            {/* in case the student have taken this course before, show details  */}
            {(prevEnrollments.length > 0) && <div className='text-center text-secondary'>
                <h5><i className="bi bi-info-circle-fill px-2"></i> You have already taken this course</h5>

                {prevEnrollments.map(course => (
                    <div key={course.id}> <small>In <strong>{course.course_offer.semester.term.name} {course.course_offer.semester.year}</strong> as <strong>{course.regular ? 'regular' : 'retake'}</strong> course</small> </div>
                ))}
            </div>}


            {/* enroll, retake or disenroll action buttons  */}
            <div className="my-4 d-flex justify-content-center">
                <div>
                    {/* show enroll button if isEnrolled is false */}
                    {!isEnrolled && prerequisitesCleared && <>
                        <button
                            type="button"
                            className="btn btn-darkblue2 pt-1 m-1"
                            disabled={!enrollmentChecked || takenBefore || isRetake}
                            onClick={() => { handleEnrollment() }}
                        >
                            Enroll
                        </button>
                    </>}
                    {/* show retake button if isRetake is true */}
                    {isRetake && prerequisitesCleared && <>
                        <button
                            type="button"
                            className="btn btn-darkblue2 pt-1 m-1 justify-content-center"
                            disabled={!enrollmentChecked}
                            data-bs-toggle="collapse"
                            data-bs-target="#retakeConfirm"
                            aria-expanded="false"
                            aria-controls="retakeConfirm"
                        >
                            Retake
                        </button>
                        {/* confirm retake with warning message */}
                        <div className="collapse" id="retakeConfirm">
                            <div className="card card-body">
                                <div className='row'>
                                    <div className='col-1 text-end fs-5 p-1'><i className="bi bi-exclamation-triangle p-2 rounded text-warning bg-darkblue"></i></div>
                                    <div className='col-11 small'>If you retake this course, then your previous enrollment grade points and credit hours will <strong>not</strong> be counted.
                                    </div>
                                </div>
                                <hr />
                                <p className='text-center'>I understood and agreed, please
                                    <a
                                        href="#"
                                        className='px-2 pt-1 mx-1 btn btn-sm btn-darkblue2'
                                        onClick={() => { handleEnrollment() }}
                                    > Enroll Me
                                    </a>
                                </p>
                            </div>
                        </div>
                    </>}
                    {/* show disenroll button if isDisenroll is true */}
                    {isDisenroll && <>
                        <button
                            type="button"
                            className="btn btn-darkblue2 pt-1 m-1"
                            disabled={!enrollmentChecked}
                            data-bs-toggle="collapse"
                            data-bs-target="#disenrollConfirm"
                            aria-expanded="false"
                            aria-controls="disenrollConfirm"
                        >
                            Disenroll
                        </button>
                        {/* confirm disenroll with warning message */}
                        <div className="collapse" id="disenrollConfirm">
                            <div className="card card-body">
                                <div className='row'>
                                    <div className='col-1 text-end fs-5 p-1'><i className="bi bi-exclamation-triangle p-2 rounded text-warning bg-darkblue"></i></div>
                                    <div className='col-11 small'>If you disenroll from this course, then your earned grade points and credit hours will be removed and cannot be recovered later.
                                    </div>
                                </div>
                                <hr />
                                <p className='text-center'>I understood the risk and agreed, please
                                    <a
                                        href="#"
                                        className='px-2 pt-1 mx-1 btn btn-sm btn-danger'
                                        onClick={() => { handleDisenrollment() }}
                                    > Disenroll
                                    </a>
                                </p>
                            </div>
                        </div>
                    </>}
                </div>
            </div>

        </div>
    );
};



export default StudentCourseEnroll;

