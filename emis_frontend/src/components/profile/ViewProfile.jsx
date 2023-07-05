/**
 * Calling from: profile.jsx
 * Calling to: 
 */

import React from 'react';
import {getFileLink, getUserId, getUserRole} from '../../utils/auth';

const ViewProfile = ({ componentController, user, profile }) => {
    const genders = {
        'M': 'Male',
        'F': 'Female',
        'O': 'Other',
        'U': 'Undefined'
    }

    const divStyle = {
        width: '200px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const userId = getUserId();
    const userRole = getUserRole();


    const iconHTML = '<i className="bi bi-person-bounding-box"></i>'; 

    return (
        <div className="container rounded-4 bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-4 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">

                        <div className='bg-darkblue text-beige rounded-2 my-4 text-capitalize' style={{width: '200px', height: '25px'}}>
                            <i className="bi bi-person-fill-gear  me-2"></i>  
                            {['administrator', 'teacher', 'student', 'staff'].includes(user.role) ? user.role : 'None'}
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
                        
                        <button className="btn btn-sm btn-beige profile-button my-4 rounded-2" onClick={() => componentController('settings')} type="button"  style={{width: '200px'}}>
                            <i className="bi bi-gear"></i> Profile Settings
                        </button>

                    </div>
                </div>
                <div className="col-md-8 border-start-2 border-light">
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
                        { profile.designation && 
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


                        <div className="mt-5 text-center">
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewProfile;
