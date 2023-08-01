/**
 * Calling from: ManageAcademicRecords.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getFileLink } from '../../../utils/auth.js';
import { getOrdinal } from '../../../utils/utils.js'; 


const BasicStudentInfo = ({ studentData }) => {
    const [enrollmentId, setEnrollmentId] = useState('');
    const [program, setProgram] = useState('');

    
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
        };

        // Fetch program only if studentData and enrollmentId are available
        if (studentData && studentData.enrollment && studentData.enrollment.id) {
            fetchProgram();
        }
    }, [studentData]);
    


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
                            {/* student name and id  */}
                            {studentData.user && <>
                                <h4 className="">{`${studentData.user.first_name} ${studentData.user.middle_name} ${studentData.user.last_name}`}</h4>
                                <h5 className="small">ID: <span className='user-select-all'>{studentData.user.username}</span></h5>
                            </>}

                            {/* Student Enrollment Information */}
                            {program && <>
                                <small className="d-block fw-bold text-body-secondary">Programme: {program.code} - {program.degree_type.acronym} in {program.name} ({program.acronym}) </small>
                            
                                <small className="d-block fw-bold text-body-secondary">
                                    Batch: {getOrdinal(studentData.enrollment.batch_section.batch_data.number)};
                                    Section: {studentData.enrollment.batch_section.name}
                                </small>
                                {/* semester  */}
                                {studentData.enrollment.semester && studentData.enrollment.semester.term &&
                                    < small className="d-block fw-bold text-body-secondary">Current/Last Semester: {studentData.enrollment.semester.term.name} {studentData.enrollment.semester.year}</small>
                                }
                            </>}

                            {/* student contact info  */}
                            <div className="mt-2">
                                {studentData.user && <>
                                    <h5 className="fs-6 text-body-secondary user-select-all"><i className="bi bi-envelope-fill"></i> {studentData.user.email}</h5>
                                </>}
                                <h5 className="fs-6 text-body-secondary user-select-all"><i className="bi bi-telephone-fill"></i> {studentData.phone}</h5>
                            </div>

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


export default BasicStudentInfo; 

