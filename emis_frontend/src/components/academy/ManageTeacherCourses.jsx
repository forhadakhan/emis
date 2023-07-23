/**
 * Calling from: TeacherActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Select from 'react-select'
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getProfileData } from '../../utils/auth.js';


const ManageTeacherCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const teacherProfile = getProfileData();
    const teacherId = teacherProfile.id;
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('DesignationList');
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


const CourseList = ({ courseOfferView, courseOfferings }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        setFilteredData(courseOfferings);
    }, [courseOfferings]);


    const handleCourseClick = (course) => {
        courseOfferView(course);
    };

    const getCourseStatus = (status) => {
        return status ? 'Completed' : 'Running';
    }

    const columns = [
        {
            name: 'Status',
            selector: (row) => `${row.semester.is_finished}`,
            sortable: true,
            cell: (row) => getCourseStatus(row.semester.is_finished),
            width: '10%',
        },
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
                `${getCourseStatus(cf.semester.is_finished)}`.toLowerCase().includes(keyword) ||
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


const CourseDetails = ({ courseOffer, handleBack }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('');
    const [students, setStudents] = useState([]);
    const {
        id,
        semester,
        course,
        teacher,
        capacity
    } = courseOffer;


    const fetchEnrolledStudents = () => {
        setError('');

        axios.get(`${API_BASE_URL}/academy/course_offer/${id}/students/`, {
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
            case 'EnrolledStudents':
                return <EnrolledStudents courseOffer={courseOffer} students={students} />
            default:
                return <></>
        }
    }


    return (
        <div className="mt-4 font-merriweather">

            <a className="icon-link icon-link-hover mb-2" href="#" onClick={handleBack}>
                <small><i className="bi bi-arrow-bar-left"></i> Goto List</small>
            </a>

            {/* course info */}
            <div className="course-border-beige content-sm-85">
                <div className="">
                    <h4 className="card-title text-center fw-bolder">{course.name}</h4>
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
                            <span className='d-block text-darkblue fw-light border-bottom'>Seats</span>
                            <span className='d-block text-darkblue fw-bold'>{capacity}</span>
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

            {/* action buttons */}
            <div className="my-4 d-flex justify-content-center">
                <div class="btn-group gap-2" role="group" aria-label="Basic example">
                    <button type="button" class="btn btn-darkblue2 pt-1" onClick={() => { setShowComponent('EnrolledStudents') }}>Students</button>
                    <button type="button" class="btn btn-darkblue2 pt-1" onClick={() => { setShowComponent('Results') }}>Results</button>
                    <button type="button" class="btn btn-darkblue2 pt-1">Discussion</button>
                </div>
            </div>

            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className='my-5'>
                {renderComponent()}
            </div>

        </div>
    );
};


const EnrolledStudents = ({ courseOffer, students }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');

    
    useEffect(() => {
        setFilteredData(students);
    }, [students]);


    const columns = [
        {
            name: 'ID and Name',
            selector: (row) => `${row.user.first_name} ${row.user.middle_name} ${row.user.last_name} ${row.user.username} `,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{row.user.first_name} {row.user.middle_name} {row.user.last_name}</strong>
                    <small>{row.user.username}</small>
                </div>
            ),
            width: '',
        },
        {
            name: 'Contact',
            selector: (row) => `${row.user.email} ${row.phone} `,
            sortable: true,
            cell: (row) => (
                <div>
                    <small className='d-block'>{row.user.email}</small>
                    <small>{row.phone}</small>
                </div>
            ),
            width: '',
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
        const filteredResults = students.filter(
            (stu) =>
                `${stu.user.first_name} ${stu.user.middle_name} ${stu.user.last_name} ${stu.user.username} `.toLowerCase().includes(keyword) ||
                `${stu.user.email} ${stu.phone}`.toLowerCase().includes(keyword) 
        );
        setFilteredData(filteredResults);
    };


    return (
        <div>
            
            <h1 className='text-center fs-4'>
                Enrolled Students 
                <span className='badge bg-success mx-2 fs-6'>Total: {students ? `${students.length}/${courseOffer.capacity}` : ''}</span>
            </h1>
            
            <div>
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

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

        </div>
    );
};




export default ManageTeacherCourses;

