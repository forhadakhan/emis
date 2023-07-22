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


const CourseList = ({ courseView, enrolledCourses }) => {
    const [filteredData, setFilteredData] = useState(enrolledCourses);
    const [error, setError] = useState('');


    useEffect(() => {
        setFilteredData(enrolledCourses);
    }, [enrolledCourses]);


    const handleCourseClick = (course) => {
        courseView(course);
    };

    const getDesignations = (designations) => {
        // Check if the input is an array and if it has elements
        if (!Array.isArray(designations) || designations.length === 0) {
            return ''; // Return an empty string if no designations or invalid input
        }

        // Extract the names from each element in the "designations" array
        const names = designations.map((designation) => designation.name);

        // Join the names using commas and return the result
        return names.join(', ');
    }

    const getDepartments = (departments) => {
        // Check if the input is an array and if it has elements
        if (!Array.isArray(departments) || departments.length === 0) {
            return ''; // Return an empty string if no departments or invalid input
        }

        // Extract the "acronym - code" for each department object
        const departmentDetails = departments.map(
            (department) => ` ${department.acronym}-${department.code} `
        );

        // Join the department details using semicolons and return the result
        return departmentDetails.join('; ');
    }

    const columns = [
        {
            name: 'Semester',
            selector: (row) => `${row.course_offer.semester.term.name} ${row.course_offer.semester.year}`,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.course_offer.semester.term.name} {row.course_offer.semester.year}</strong>
                    <small>{row.course_offer.semester.term.start} to {row.course_offer.semester.term.end}</small>
                </div>
            ),
        },
        {
            name: 'Course',
            selector: (row) => row.course_offer.course.name,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.course_offer.course.name}</strong>
                    <small>{row.course_offer.course.acronym} {row.course_offer.course.code}: Credit {row.course_offer.course.credit}</small>
                </div>
            ),
        },
        {
            name: 'Teacher',
            selector: (row) => `${row.course_offer.teacher.teacher.user.first_name} `,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>
                        {row.course_offer.teacher.teacher.user.first_name}
                        {row.course_offer.teacher.teacher.user.middle_name}
                        {row.course_offer.teacher.teacher.user.last_name}
                        ({row.course_offer.teacher.teacher.acronym})
                    </strong>
                    <small>
                        {getDesignations(row.course_offer.teacher.designations)}, Dept. of
                        {getDepartments(row.course_offer.teacher.departments)}
                    </small>
                </div>
            ),
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
        const filteredResults = enrolledCourses.filter(
            (ec) =>
                `${ec.course_offer.semester.term.name} ${ec.course_offer.semester.year}`.toLowerCase().includes(keyword) ||
                `${ec.course_offer.semester.term.start} to ${ec.course_offer.semester.term.end}`.toLowerCase().includes(keyword) ||
                `${ec.course_offer.teacher.teacher.user.first_name} ${ec.course_offer.teacher.teacher.user.middle_name} ${ec.course_offer.teacher.teacher.user.last_name} (${ec.course_offer.teacher.teacher.acronym})`.toLowerCase().includes(keyword) ||
                `${getDesignations(ec.course_offer.teacher.designations)}, Dept. of ${getDepartments(ec.course_offer.teacher.departments)}`.toLowerCase().includes(keyword) ||
                `${ec.course_offer.course.name} ${ec.course_offer.course.acronym} ${ec.course_offer.course.code}`.toLowerCase().includes(keyword) ||
                `Credit ${ec.course_offer.course.credit}`.toLowerCase().includes(keyword) ||
                ec.course_offer.course.name.toLowerCase().includes(keyword) ||
                ec.is_complete.toString().includes(keyword)
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
                    <option value="false">Running Courses</option>
                    <option value="true">Completed Courses</option>
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


const CourseDetails = ({ courseOffer, handleBack }) => {
    const {
        id,
        semester,
        course,
        teacher,
        capacity,
        is_complete
    } = courseOffer.course_offer;


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
                        <span className="nav-link border text-center bg-white m-1">
                            <span className='d-block text-darkblue fw-light border-bottom'>Status</span>
                            <span className='d-block text-darkblue fw-bold'>{semester.is_finished ? 'Completed' : 'Running'}</span>
                        </span>
                        <span className="nav-link border text-center bg-white m-1 rounded-end">
                            <span className='d-block text-darkblue fw-light border-bottom'>Semester</span>
                            <span className='d-block text-darkblue fw-bold'>{semester.term.name} {semester.year}</span>
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

        </div>
    );
};



export default ManageStudentCourses;

