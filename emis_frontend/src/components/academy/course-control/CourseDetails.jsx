/**
 * Calling from: 
 *              ManageTeacherCourses.jsx
 *              ControlOfferedCourse.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken } from '../../../utils/auth.js';

import Marksheet from '../MarksheetController.jsx';


const CourseDetails = ({ courseOffer, handleBack }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('');
    const [students, setStudents] = useState([]);
    const [status, setStatus] = useState(courseOffer.is_complete);
    const [statusMessage, setStatusMessage] = useState('');
    const {
        id,
        semester,
        course,
        teacher,
        capacity,
        is_complete
    } = courseOffer;


    const updateStatus = (id, status) => {
        setStatusMessage('');

        const formData = {
            is_complete: status,
        }

        axios.patch(`${API_BASE_URL}/academy/course-offers/${id}/`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        })
            .then(response => {
                const data = response.data;
                setStatus(formData.is_complete);
                setStatusMessage("Successfully Updated");
            })
            .catch(error => {
                setStatusMessage("Error updating status");
                console.error('Error updating status', error);
            });
    };


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
            case 'Marksheet':
                return <Marksheet courseOffer={courseOffer} students={students} />
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
                            <span className='d-block text-darkblue fw-bold'>{status ? 'Completed' : 'Running'}</span>
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
                <div className="btn-group gap-2" role="group" aria-label="Basic example">
                    <button
                        type="button"
                        className="btn btn-darkblue2 pt-1"
                        onClick={() => { setShowComponent('EnrolledStudents') }}
                        disabled={showComponent === 'EnrolledStudents'}
                    > Students
                    </button>
                    <button
                        type="button"
                        className="btn btn-darkblue2 pt-1"
                        onClick={() => { setShowComponent('Marksheet') }}
                        disabled={showComponent === 'Marksheet'}
                    > Marksheet
                    </button>
                    <button
                        type="button"
                        className="btn btn-darkblue2 pt-1"
                        onClick={() => { setShowComponent('EditStatus') }}
                        disabled={showComponent === 'EditStatus'}
                    > Status
                    </button>
                    <button
                        type="button"
                        className="btn btn-darkblue2 pt-1"
                    > Discussion
                    </button>
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

            {/* status update  */}
            {(showComponent === 'EditStatus') && <>
                <div className="border border-3 p-4 rounded-4 bg-white">
                    <h4 className="text-center">
                        Current course status is: <span className='badge bg-beige text-darkblue mx-2'>{status ? 'Completed' : 'Running'}</span>
                    </h4>

                    <div className="d-flex">
                        <button
                            className="btn btn-darkblue2 pt-1 mx-auto my-3"
                            onClick={() => { updateStatus(id, !status) }}
                        >
                            {status ? 'Mark as running' : 'Mark as completed'}
                        </button>
                    </div>

                    {statusMessage && (
                        <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                            <strong> {statusMessage} </strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                        </div>
                    )}

                </div>
            </>}

        </div>
    );
};


const EnrolledStudents = ({ courseOffer, students }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        setFilteredData(students);
    }, [students]);

    const handleCourseClick = (data) => {

    }


    const columns = [
        {
            name: 'Name and ID',
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
        // {
        //     name: 'Actions',
        //     button: true,
        //     cell: (row) => (
        //         <button
        //             type="button"
        //             className="btn btn-sm btn-outline-dark me-2 border-0"
        //             onClick={() => handleCourseClick(row)}
        //         >
        //             Details
        //         </button>
        //     ),
        // },
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
                <i className="bi bi-people"> </i>
                Enrolled Students
            </h1>
            <p className='text-center'>
                <span className='badge bg-success mx-2 fw-normal'>Total: {students ? `${students.length}/${courseOffer.capacity}` : ''}</span>
            </p>

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


export default CourseDetails;

