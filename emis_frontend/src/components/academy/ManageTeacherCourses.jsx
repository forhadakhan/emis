/**
 * Calling from: TeacherActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getProfileData } from '../../utils/auth.js';


const ManageTeacherCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const teacherProfile = getProfileData();
    const teacherId = teacherProfile.id;
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('');
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
                    <button
                        type="button"
                        class="btn btn-darkblue2 pt-1"
                        onClick={() => { setShowComponent('EnrolledStudents') }}
                        disabled={showComponent === 'EnrolledStudents'}
                    > Students
                    </button>
                    <button
                        type="button"
                        class="btn btn-darkblue2 pt-1"
                        onClick={() => { setShowComponent('Marksheet') }}
                        disabled={showComponent === 'Marksheet'}
                    > Marksheet
                    </button>
                    <button
                        type="button"
                        class="btn btn-darkblue2 pt-1"
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
                <i class="bi bi-people"> </i>
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


const Marksheet = ({ courseOffer, students }) => {
    const accessToken = getAccessToken();
    const [filteredData, setFilteredData] = useState([]);
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedMarksheet, setSelectedMarksheet] = useState('');
    const [relStudent, setRelStudent] = useState('');
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        setFilteredData(marksheets);
    }, [marksheets]);


    const fetchMarksheets = (courseOfferId) => {
        setError('');

        axios.get(`${API_BASE_URL}/academy/course-offer/marksheets/${courseOfferId}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setMarksheets(response.data);
            })
            .catch(error => {
                setError("Error fetching marksheets");
                console.error('Error fetching marksheets:', error);
            });
    };
    // Fetch marksheets when the component mounts
    useEffect(() => {
        fetchMarksheets(courseOffer.id);
    }, [accessToken, refresh]);


    const getStudent = (id) => {
        const student = students.find((stu) => stu.id === id)
        if (student) {
            const data = {
                name: `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}`,
                username: `${student.user.username}`,
                both: `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name} ${student.user.username}`,
            }
            return data;
        }
        return '';
    }


    const handleMarksControllerClick = (selected_marksheet, student) => {
        setSelectedMarksheet(selected_marksheet);
        setRelStudent(student);
        setShowUpdateModal(true);
    }


    const columns = [
        {
            name: 'Name & ID',
            selector: (row) => `${getStudent(row.course_enrollment.student).both} `,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{getStudent(row.course_enrollment.student).name}</strong>
                    <small>{getStudent(row.course_enrollment.student).username}</small>
                </div>
            ),
            width: '21%',
        },
        {
            name: 'Attendance',
            selector: (row) => row.attendance,
            sortable: true,
            width: '',
        },
        {
            name: 'CT/Assignment',
            selector: (row) => row.assignment,
            sortable: true,
            width: '',
        },
        {
            name: 'Mid-term',
            selector: (row) => row.mid_term,
            sortable: true,
            width: '',
        },
        {
            name: 'Final',
            selector: (row) => row.final,
            sortable: true,
            width: '',
        },
        {
            name: 'Total',
            selector: (row) => row.attendance + row.assignment + row.mid_term + row.final,
            sortable: true,
            width: '',
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleMarksControllerClick(row, getStudent(row.course_enrollment.student))}
                > 
                    Update    
                    <i className="bi bi-pen px-1"></i>  
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
        const filteredResults = marksheets.filter(
            (ms) =>
                `${getStudent(ms.course_enrollment.student).both} `.toLowerCase().includes(keyword) || 
                `${ms.attendance} ${ms.assignment} ${ms.mid_term} ${ms.final}`.includes(keyword) || 
                `${ms.attendance + ms.assignment + ms.mid_term + ms.final}`.includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    return (
        <div>

            <h1 className='text-center fs-4'>
                <i className="bi bi-list-columns"> </i>
                Marksheet
            </h1>
            <p className='text-center'>
                <span className='badge bg-success mx-2 fw-normal'>Total Students: {students ? `${students.length}/${courseOffer.capacity}` : ''}</span>
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



                {showUpdateModal &&
                    <MarksControllerModal
                        show={showUpdateModal}
                        handleClose={() => setShowUpdateModal(false)}
                        marksheet={selectedMarksheet}
                        student={relStudent}
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />}
            </div>

        </div>
    );
};


const MarksControllerModal = ({ show, handleClose, marksheet, student, refresh, setRefresh }) => {
    const { course_enrollment, ...updatedMS } = marksheet;
    const [updatedMarksheet, setUpdatedMarksheet] = useState(updatedMS);
    const [updateMessage, setUpdateMessage] = useState('');
    const accessToken = getAccessToken();
    const maxValue = 100;

    // for validation
    const getMaxValue = (field_name) => {
        switch (field_name) {
            case 'attendance':
                return 10;
            case 'assignment':
                return 20;
            case 'mid_term':
                return 30;
            case 'final':
                return 40;
            default:
                return 0;
        }
    }

    // validate marks
    const validateMarks = (data) => {
        const invalidFields = [];

        // Loop through each field in the data object and validate its value
        Object.keys(data).forEach((field) => {
            if (field === 'id' || field === 'course_enrollment') {
                return; // Skip 'id' and 'course_enrollment' fields
            }

            const value = parseInt(data[field], 10); // Convert the value to an integer

            if (isNaN(value) || value < 0 || value > getMaxValue(field)) {
                invalidFields.push(field);
                console.log(field);
            }
        });

        return invalidFields;
    }

    // handle marks input 
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validate the input value (should be between 0 and max value)
        if (value < 0 || value > getMaxValue(name)) {
            // If the input value is out of range, show an error message
            setUpdateMessage(`Wrong input! Range is 0 to ${getMaxValue(name)}`);
            return;
        }
        else {
            // Clear the error message if the input value is within the valid range
            setUpdateMessage('');

            setUpdatedMarksheet((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

    };

    // handle update marksheet 
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage('');

        // don't proceed if data not changed
        // as we are using required in input, this may not needed
        // if (JSON.stringify(updatedMarksheet) === JSON.stringify(marksheet)) {
        //     setUpdateMessage('No changes detected!');
        //     return;
        // }

        // validate data
        const invalidFields = validateMarks(updatedMarksheet);
        if (invalidFields.length > 0) {
            setUpdateMessage("Invalid input detected");
        }

        // make update request to api endpoint
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.patch(
                `${API_BASE_URL}/academy/marksheets/${updatedMarksheet.id}/`,
                updatedMarksheet,
                config
            );

            setUpdateMessage('Updated Successfully');
            setRefresh(!refresh); // reload the updated data in Marksheets 
        } catch (error) {
            setUpdateMessage('Update failed, an error occurred.');
            console.error(error);
        }
    };


    return (<>

        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content border border-beige">
                        <div className="modal-header bg-darkblue text-beige">
                            <h5 className="modal-title fs-4"><i className="bi bi-pen"></i> Update Marks </h5>
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='bg-beige m-2 p-2 rounded text-center'>
                                <strong className='d-block'>{student.name}</strong>
                                <small>{student.username}</small>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label htmlFor="attendance" className="form-label text-darkblue">Attendance</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 10'
                                        id="attendance"
                                        name="attendance"
                                        value={updatedMarksheet.attendance}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="assignment" className="form-label text-darkblue">CT/Assignment</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 20'
                                        id="assignment"
                                        name="assignment"
                                        value={updatedMarksheet.assignment}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mid_term" className="form-label text-darkblue">Mid-term</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 30'
                                        id="mid_term"
                                        name="mid_term"
                                        value={updatedMarksheet.mid_term}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="final" className="form-label text-darkblue">Final</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 40'
                                        id="final"
                                        name="final"
                                        value={updatedMarksheet.final}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-darkblue2 fw-medium d-flex mx-auto">Update</button>
                            </form>
                            {updateMessage && <div className='p-3 text-center'>{updateMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};


export default ManageTeacherCourses;

