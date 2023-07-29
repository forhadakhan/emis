/**
 * Calling from: ManagerialActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, getFileLink } from '../../utils/auth';
import { getOrdinal } from '../../utils/utils';


// Main Component 
const ManageAcademicRecords = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('FindAStudent');
    const [studnetId, setStudnetId] = useState('');
    const [studentData, setStudentData] = useState('');

    // add current component in breadcrumb 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageAcademicRecords')}>
            <i className="bi-list-columns"></i> Manage Academic Records
        </button>
    );

    // check and return selected compnent to show and  
    const renderComponent = () => {
        switch (showComponent) {
            case 'ListAllStudent':
                return <ListAllStudent setStudnetId={setStudnetId} />;
            case 'FindAStudent':
                return <FindAStudent setStudnetId={setStudnetId} />;
            case 'StudentRecords':
                return <StudentRecords studentData={studentData} />;
            default:
                return <><p className='text-center m-5'>Something went wrong while rendering component!</p></>;
        }
    }


    return (
        <>
            {/* breadcrumb */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* headings  */}
            <h2 className="text-center m-5 px-2">
                <i className="bi-list-columns"></i> Manage Academic Records
            </h2>

            {/* student select option  */}
            <nav className="nav nav-pills flex-column flex-sm-row my-4">

                {/* option to find a student by username  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'FindAStudent'}
                    onClick={() => setShowComponent('FindAStudent')}>
                    Find a student
                </button>

                {/* option to find a student from all student list  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'ListAllStudent'}
                    onClick={() => setShowComponent('ListAllStudent')}>
                    List all student
                </button>
            </nav>

            {/* render component based on preference  */}
            <div className="">
                <GetTheStudent setShowComponent={setShowComponent} username={studnetId} setStudentData={setStudentData} />
                {renderComponent()}
            </div>
        </>
    );
}


// Sub Component
const GetTheStudent = ({ setShowComponent, username, setStudentData }) => {
    const [error, setError] = useState('');
    const accessToken = getAccessToken();

    const fetchTheStudent = () => {
        setError('');

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const url = `${API_BASE_URL}/student/id/${username}`;

        // Make the API request to get the user
        axios.get(url, config)
            .then(response => {
                setStudentData(response.data);
                setShowComponent('StudentRecords')
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError('An error occurred while retrieving the student.');
                    console.error(error);
                }
            });
    };

    useEffect(() => {
        if (username) {
            fetchTheStudent();
        }
    }, [username])


    return (<>
        {error &&
            <div className="alert alert-danger alert-dismissible fade show border border-darkblue mx-md-5" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <strong> {error} </strong>
                <button type="button" onClick={() => setError('')} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
    </>);

}


// Sub Component 
const FindAStudent = ({ setStudnetId }) => {
    const [username, setUsername] = useState('');
    setStudnetId('');

    const handleFindUser = (e) => {
        e.preventDefault();
        setStudnetId(username);
    }

    return (
        <div>
            <form onSubmit={handleFindUser}>
                <div className="mb-3 my-5 mx-md-5">
                    <label htmlFor="usernameInput" className="form-label"><i className="bi bi-input-cursor-text"></i> Enter username</label>
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
    );
}


// Sub component
const StudentList = ({ studentUsers, setStudnetId }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setData(studentUsers);
    }, [studentUsers]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = data.filter(
            (user) =>
                user.pk.toString().toLowerCase().includes(keyword) ||
                user.fields.username.toLowerCase().includes(keyword) ||
                user.fields.first_name.toLowerCase().includes(keyword) ||
                user.fields.last_name.toLowerCase().includes(keyword) ||
                user.fields.email.toLowerCase().includes(keyword) ||
                ((user.fields.is_active && (keyword === 'active' || keyword === 'unblocked')) ||
                    (!user.fields.is_active && (keyword === 'inactive' || keyword === 'blocked')))
        );
        setFilteredData(filteredResults);
    };

    const columns = [
        {
            name: 'ID/Username',
            selector: (row) => row.fields.username,
            sortable: true,
            width: '14%'
        },
        {
            name: 'First Name',
            selector: (row) => row.fields.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.fields.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.fields.email,
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <div className='mx-auto'>
                    {/* view student select button */}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2 border-0"
                        onClick={() => handleSelect(row.fields.username)}
                        data-bs-toggle="tooltip"
                        data-bs-title="Manage Profile"
                    >
                        Select
                    </button>
                </div>
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
                fontWeight: 'bold'
            },
        },
    };

    const handleSelect = (username) => {
        setStudnetId(username);
    };


    return (
        <div>
            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                    <option value="unblocked">Not Blocked</option>
                </select>
            </div>
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                customStyles={customStyles}
                className='rounded rounded-4 border border-beige'
            />
        </div>
    );
};


// Sub Component 
const ListAllStudent = ({ setStudnetId }) => {
    const accessToken = getAccessToken();
    const [studentUsers, setStudentUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    setStudnetId('');

    // fetch  users with 'student' role for StudentList
    useEffect(() => {
        setAlertMessage('');
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/student/users/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStudentUsers(response.data);
            } catch (error) {
                setAlertMessage('Error fetching student users');
                console.error('Error fetching student users:', error);
            }
        };
        fetchUserData();
    }, []);


    return (<>
        {alertMessage && (
            <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <strong>{alertMessage}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
            </div>
        )}

        {/* render student user list  */}
        <div>
            <StudentList studentUsers={studentUsers} setStudnetId={setStudnetId} />
        </div>

    </>)
}


// Sub Component 
const StudentRecords = ({ studentData }) => {
    const [enrollmentId, setEnrollmentId] = useState('');
    const [program, setProgram] = useState('')

    useEffect(() => {
        if(studentData.enrollment) {
            setEnrollmentId(studentData.enrollment.id);
        }
    }, [])


    // get program details for student
    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const accessToken = getAccessToken();
                const programId = studentData.enrollment.batch_section.batch_data.program;

                const response = await axios.get(
                    `${API_BASE_URL}/academy/programs/${programId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setProgram(response.data);
            } catch (error) {
                // console.error('Error fetching program:', error);
                setProgram('');
            }
        }
        fetchProgram();
    }, [enrollmentId])


    return (<>

        {/* if there student data, show some info about the student  */}
        {studentData && <>
            <div className="col-sm-12 col-md-8 mx-auto my-5">
                <div className="row g-0">
                    <div className="col-md-3">
                        {/* student photo  */}
                        <div className={`rounded-2 mx-auto ${studentData.photo_id ? '' : 'bg-darkblue'} text-beige`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }}>
                            {studentData.photo_id ? (
                                <img src={getFileLink(studentData.photo_id)} className="img-fluid rounded mx-auto d-flex border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }} alt="..." />
                            ) : (
                                <i className="bi bi-person-bounding-box fs-1"></i>
                            )}
                        </div>
                    </div>
                    <div className="col-md-9 p-3">
                        <div className="ms-5">
                            {studentData.user && <>
                                <h4 className="">{`${studentData.user.first_name} ${studentData.user.middle_name} ${studentData.user.last_name}`}</h4>
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-person-fill"></i> {studentData.user.username}</h5>
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-envelope-fill"></i> {studentData.user.email}</h5>
                            </>}
                            <h5 className="fs-6 text-body-secondary"><i className="bi bi-telephone-fill"></i> {studentData.phone}</h5>

                            {/* Student Enrollment Information */}
                            {program && enrollmentId && 
                                <small className="d-block fw-bold text-body-secondary">{program.name}</small>
                            }    
                            {enrollmentId && <>
                                <small className="d-block fw-bold text-body-secondary">
                                    Batch: {getOrdinal(studentData.enrollment.batch_section.batch_data.number)};
                                    Section: {studentData.enrollment.batch_section.name}
                                </small>
                                {/* semester  */}
                                {/* <small className="d-block fw-bold text-body-secondary">{studentData.enrollment.semester.term.name} {studentData.enrollment.semester.year}</small> */}
                            </>}

                            {/* {enrollmentId && <>
                                {studentData.enrollment.enrolled_by &&
                                    <small className='d-block text-secondary'>Enrolled by: {studentData.enrollment.enrolled_by.username}</small>}
                                {studentData.enrollment.updated_by &&
                                    <small className='d-block text-secondary'>Last updated by: {studentData.enrollment.updated_by.username}</small>}
                            </>} */}

                        </div>
                    </div>
                </div>
            </div>
        </>}


    </>);
}




export default ManageAcademicRecords;

