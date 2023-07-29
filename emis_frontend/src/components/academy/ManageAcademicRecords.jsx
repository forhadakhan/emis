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



// Sub Component 
const ListAllStudent = () => {

}


// Sub Component 
const StudentRecords = ({ studentData }) => {
    const enrollmentId = studentData.enrollment.id;
    const [program, setProgram] = useState('')


    // get enrollment and program details for student/teacher
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
                            {program && <>
                                <small className="d-block fw-bold text-body-secondary">{program.name}</small>
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

