/**
 * Calling from: profile.jsx
 * Calling to: 
 */

import React, { useEffect, useState } from 'react';
import { getFileLink, getUserId, getUserRole, getEnrollmentData, getAccessToken } from '../../utils/auth';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';
import { getOrdinal } from '../../utils/utils';


const ViewProfile = ({ componentController, user, profile }) => {
    const [enrollment, setEnrollment] = useState('');
    const [program, setProgram] = useState('');
    const genders = {
        'M': 'Male',
        'F': 'Female',
        'O': 'Other',
        'U': 'Undefined'
    }
    const YEAR_CHOICES = {
        "FR": "Freshman ",
        "SO": "Sophomore ",
        "JR": "Junior ",
        "SR": "Senior ",
        "GR": "Graduate "
    };

    const divStyle = {
        width: '200px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const userRole = getUserRole();

    useEffect(() => {
        if (userRole === 'student') {
            const enrollmentData = getEnrollmentData();
            setEnrollment(enrollmentData);

            const fetchProgram = async () => {
                try {
                    const accessToken = getAccessToken();
                    const programId = enrollmentData.batch_section.batch_data.program;

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
                }
            }
            fetchProgram();
        }
    }, [])


    return (
        <div className="container rounded-4 bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-4 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">

                        <div className='bg-darkblue text-beige rounded-2 my-4' style={{ width: '200px', height: '25px' }}>
                            {/* <i className="bi bi-person-fill-gear  me-2"></i> */}
                            <span className="text-capitalize">{YEAR_CHOICES[enrollment.year]} </span>
                            <span className="text-capitalize">{['administrator', 'teacher', 'student', 'staff'].includes(user.role) ? user.role : 'None'} </span>
                        </div>

                        <div style={divStyle} className="border rounded-3 bg-light">
                            {profile.photo_id ? (
                                <img
                                    src={getFileLink(profile.photo_id)}
                                    style={{ width: '100%', height: '100%' }}
                                    className="rounded-3"
                                    alt="Profile Photo" />
                            ) : (
                                <div className=''><i className="bi bi-person-bounding-box fs-1"></i></div>
                            )}
                        </div>

                        <button className="btn btn-sm btn-beige profile-button my-4 rounded-2" onClick={() => componentController('settings')} type="button" style={{ width: '200px' }}>
                            <i className="bi bi-gear"></i> Profile Settings
                        </button>

                    </div>
                </div>
                <div className="col-md-8 border-start-2 border-light">

                    {(!enrollment || !enrollment.is_active) && <>
                        <div className="alert alert-primary text-center fw-bold" role="alert">
                            No active enrollment found.
                        </div>
                    </>}

                    <div className="p-3 py-5">
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <h6 className='text-secondary fw-normal'>Name</h6>
                                <h1 className=''>{user.first_name}  {user.middle_name} {user.last_name}</h1>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <h6 className='text-secondary fw-normal'>ID / Username</h6>
                                <p className='fs-5'>{user.username} </p>
                            </div>
                        </div>

                        {(userRole === 'student') && enrollment && enrollment.is_active && <>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <h6 className='text-secondary fw-normal'>Program:</h6>
                                    <p className='fs-5'>{program.name} </p>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <h6 className='text-secondary fw-normal'>Batch:</h6>
                                    <p className='fs-5'>{program.acronym} {getOrdinal(enrollment.batch_section.batch_data.number)}</p>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <h6 className='text-secondary fw-normal'>Section:</h6>
                                    <p className='fs-5'>{enrollment.batch_section.name}</p>
                                </div>
                            </div>

                        </>}

                        {profile.designation &&
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <h6 className='text-secondary fw-normal'>Designation</h6>
                                    <p className='fs-5'>{profile.designation} </p>
                                </div>
                            </div>}
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <h6 className='text-secondary fw-normal'>Email</h6>
                                <p className='fs-5'>{user.email}</p>
                            </div>
                        </div>

                        {profile &&
                            <div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Phone</h6>
                                        <p className='fs-5'>{profile.phone}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>NID</h6>
                                        <p className='fs-5'>{profile.nid}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Birth Date</h6>
                                        <p className='fs-5'>{profile.birth_date}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Gender</h6>
                                        <p className='fs-5'>{genders[profile.gender]}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Father Name</h6>
                                        <p className='fs-5'>{profile.father_name}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Mother Name</h6>
                                        <p className='fs-5'>{profile.mother_name}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Present Address</h6>
                                        <p className='fs-5'>{profile.present_address}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Permanent Address</h6>
                                        <p className='fs-5'>{profile.permanent_address}</p>
                                    </div>
                                </div>
                            </div>}


                        {(userRole === 'student') && <>
                            <div className="my-5 p-3 rounded-5 border-start border-5 border-beige">
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Guardian Name</h6>
                                        <p className='fs-5'>{profile.guardian_name}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Guardian Relationship</h6>
                                        <p className='fs-5'>{profile.guardian_relationship}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Guardian Phone</h6>
                                        <p className='fs-5'>{profile.guardian_phone}</p>
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6">
                                        <h6 className='text-secondary fw-normal'>Guardian Email</h6>
                                        <p className='fs-5'>{profile.guardian_email}</p>
                                    </div>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewProfile;
