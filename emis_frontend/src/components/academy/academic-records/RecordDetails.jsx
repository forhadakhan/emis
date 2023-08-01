/**
 * Calling from: ManageAcademicRecords.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getUserRole, hasPermission } from '../../../utils/auth.js';



const RecordDetails = ({ record }) => {
    const accessToken = getAccessToken();
    const userRole = getUserRole();
    const [selectedRecord, setSelectedRecord] = useState(record);
    let {
        id,
        course_enrollment,
        letter_grade,
        grade_point,
        status,
        attendance,
        assignment,
        mid_term,
        final,
        is_published
    } = selectedRecord;

    // Calculate the total
    const total = attendance + assignment + mid_term + final;
    const studentId = course_enrollment.student;
    const [alertMessage, setAlertMessage] = useState('');


    // handle update publish 
    const handleUpdatePublish = async () => {
        try {
            const response = await axios.patch(`${API_BASE_URL}/academy/students/${studentId}/academic-records/${id}/`, {
                is_published: !is_published
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            // in case update is successful
            setSelectedRecord(response.data);
        } catch (error) {
            setAlertMessage('Error updating publish status');
            console.error('Error updating publish status:', error);
        }
    };



    return (<>

        {/* course info  */}
        <div className="m-5">
            <table className='table w-auto fs-5'>
                <tr>
                    <td className='px-2'>Course:</td>
                    <td className='px-2 fw-bold'>{course_enrollment.course_offer.course.acronym} {course_enrollment.course_offer.course.code} - {course_enrollment.course_offer.course.name}</td>
                </tr>
                <tr>
                    <td className='px-2'>Credit:</td>
                    <td className='px-2 fw-bold'>{course_enrollment.non_credit ? 'non-credit' : course_enrollment.course_offer.course.credit}</td>
                </tr>
                <tr>
                    <td className='px-2'>Status:</td>
                    <td className='px-2 fw-bold'>{course_enrollment.course_offer.is_complete ? 'Complete' : 'Running'}</td>
                </tr>
            </table>
        </div>


        {/* show alert message, if any  */}
        {alertMessage && (
            <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <strong>{alertMessage}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
            </div>
        )}


        {/* publish status  */}
        {((userRole === 'administrator') || hasPermission('change_marksheet')) && 
        <div className="text-center m-5">
            {is_published
                ? <div className='alert bg-beige'>
                    <i className='bi bi-check-square-fill px-2'></i>
                    This record is published, which means it will appear for the student. The student will be able to see it.
                    <button onClick={() => { handleUpdatePublish() }} className='btn btn-sm mt-2 btn-danger d-block mx-auto shadow'>Unpublish</button>
                </div>
                : <div className='alert bg-beige'>
                    <i className='bi bi-x-square-fill px-2'></i>
                    This record is not published, which means it won't appear for the student. The student won't be able to see it.
                    <button onClick={() => { handleUpdatePublish() }} className='btn btn-sm mt-2 btn-darkblue2 d-block mx-auto shadow'>Publish</button>
                </div>}
        </div>}


        {/* records table  */}
        <div className='m-5'>
            <h2 className='fs-5'>Records</h2>
            <table className='table table-hover table-bordered w-auto'>
                <tbody>
                    <tr>
                        <td>Attendance (10)</td>
                        <td className='fw-bold'>{attendance}</td>
                    </tr>
                    <tr>
                        <td>Assignment (20)</td>
                        <td className='fw-bold'>{assignment}</td>
                    </tr>
                    <tr>
                        <td>Mid Term (30)</td>
                        <td className='fw-bold'>{mid_term}</td>
                    </tr>
                    <tr>
                        <td>Final (40)</td>
                        <td className='fw-bold'>{final}</td>
                    </tr>
                    <tr>
                        <td>Total (100)</td>
                        <td className='fw-bold'>{total}</td>
                    </tr>
                    <tr>
                        <td>Grade Point (GP)</td>
                        <td className='fw-bold'>{grade_point}</td>
                    </tr>
                    <tr>
                        <td>Letter Grade (LG)</td>
                        <td className='fw-bold'>{letter_grade}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td className='fw-bold text-capitalize'>{status}</td>
                    </tr>
                </tbody>
            </table>
        </div>

    </>);
}


export default RecordDetails; 
