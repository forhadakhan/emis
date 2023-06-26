/**
 * Parent: Activity.jsx;
 * Call From: ManageStaff.jsx(reference)
 * Call to: ManageProfileUserForm.jsx; ManageProfileOthersForm.jsx; 
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserRole } from '../../../utils/auth';
import ManageProfileUserForm from './ManageProfileUserForm';
import ManageProfileOthersForm from './ManageProfileOthersForm';


const ManageProfile = ({ setActiveComponent, reference, userType }) => {
    const [staffPK, setStaffPK] = useState(null);
    const [userPK, setUserPK] = useState(null);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [isBlock, setIsBlock] = useState(false);
    const [isUnblock, setIsUnblock] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [viewedUserRole, setViewedUserRole] = useState('');
    const accessToken = getAccessToken();
    const url = `${API_BASE_URL}/${userType}/profile`;
    
    const setComp = {
        administrator: "ManageAdministrator",
        staff: "ManageStaff",
        student: "ManageStudent",
        teacher: "ManageTeacher",
    }


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        reference: reference,
                    },
                });

                const data = response.data;
                setStaffPK(data.pk);
                setProfileData(data.fields);
                setIsActive(data.fields.user.is_active);
                setUserPK(data.fields.user.id);
                setUsername(data.fields.user.username);
                setViewedUserRole(data.fields.user.role);
                setFullName(`${data.fields.user.first_name} ${data.fields.user.middle_name} ${data.fields.user.last_name}`)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [reference, accessToken]);

    const handleBlock = (activeState) => {
        setIsActive(activeState);
        const fetchUserData = async () => {
            try {
                const response = await axios.patch(
                    `${API_BASE_URL}/user/update-partial/${userPK}/`,
                    { is_active: activeState },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                activeState ? setToastMessage('User Unblocked Successfully.') : setToastMessage('User Blocked Successfully.');
            } catch (error) {
                setToastMessage(`Error updating user: ${error}`);
                console.error('Error updating user:', error);
            }
        };
        fetchUserData();
    };

    const handleDelete = () => {
        const fetchUserData = async () => {
            try {
                const response = await axios.delete(
                    `${API_BASE_URL}/user/delete/${userPK}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setShowDeleteSuccessModal(true);                 
            } catch (error) {
                setShowDeleteErrorModal(true); 
                console.error('Error deleting user:', error);
            }
        };
        fetchUserData();
    }

    return (
        <div>
            {viewedUserRole === "staff" && 
            <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('ManageStaff')}>
                <i className="bi bi-arrow-bar-left"></i> Back to manage staff panel
            </a>}
            {viewedUserRole === "administrator" && 
            <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('ManageAdministrator')}>
                <i className="bi bi-arrow-bar-left"></i> Back to manage administrator panel
            </a>}

            <h3 className="pb-2 border-bottom">
                <div className="icon-square mt-4 text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-person-plus"></i>
                </div>
                Manage Profile
            </h3>

            <div className="container d-flex align-items-center justify-content-center">
                {!isActive && (
                    <div className="alert alert-warning m-5" role="alert">
                        <i className="bi bi-person-fill-slash fs-5"></i> This user is <strong>blocked</strong>.
                    </div>
                )}
            </div>
            <div className="container d-flex align-items-center justify-content-center">
                <div className="btn-group m-5 " role="group" aria-label="Basic outlined example">
                    {isActive ? (
                        <button type="button" className="btn btn-beige pt-1" onClick={() => setIsBlock(true)}><i className="bi bi-person-fill-slash"></i> Block </button>
                    ) : (
                        <button type="button" className="btn btn-beige pt-1" onClick={() => setIsUnblock(true)}><i className="bi bi-person-check"></i> Unblock </button>
                    )}
                    <button type="button" className="btn btn-beige pt-1 ms-2" onClick={() => setIsDelete(true)}><i className="bi bi-person-x-fill"></i> Delete </button>
                </div>
            </div>
            {isBlock &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to BLOCK this user?</h6>
                            <button type="button" className="btn btn-danger" onClick={() => { handleBlock(false), setIsBlock(false); }}> Yes </button>
                            <button type="button" className="btn btn-danger ms-2" onClick={() => setIsBlock(false)}> No </button>
                        </div>
                    </div>
                </div>}
            {isUnblock &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to UNBLOCK this user?</h6>
                            <button type="button" className="btn btn-danger" onClick={() => { setIsUnblock(false); handleBlock(true) }}> Yes </button>
                            <button type="button" className="btn btn-danger ms-2" onClick={() => setIsUnblock(false)}> No </button>
                        </div>
                    </div>
                </div>}
            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this user?</h6>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                            <button type="button" className="btn btn-danger ms-2" onClick={() => setIsDelete(false)}> No </button>
                        </div>
                    </div>
                </div>}

            <div className="m-4 border border-beige p-5 rounded-3">
                {profileData && (
                    <ManageProfileOthersForm data={profileData} userType={userType} full_name={fullName} username={username} related_to={staffPK} status={false} />
                )}
            </div>
            <div className="m-4 border border-beige p-5 rounded-3">
                <h3 className='text-center m-4 text-darkblue border fs-5 border-darkblue rounded-3 p-2 mx-5 bg-beige'>Core Data</h3>
                {profileData && profileData.user && (
                    <ManageProfileUserForm data={profileData.user} related_to={staffPK} status={false} />
                )}
            </div>


            {showDeleteSuccessModal && (
                <div className="bg-blur">
                    <div className={`modal ${showDeleteSuccessModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showDeleteSuccessModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-darkblue border border-beige text-beige">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-check-circle-fill"></i> Saved </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={setActiveComponent(setComp[viewedUserRole])}> 
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                    <i className="bi bi-person-x-fill"></i> Delete was successful!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} 
            {showDeleteErrorModal && (
                <div className="bg-blur">
                    <div className={`modal ${showDeleteErrorModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showDeleteErrorModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-danger border border-beige text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-exclamation-octagon-fill"></i> Failed </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={showDeleteErrorModal(false)}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                <i className="bi bi-x-circle"></i>  Not deleted, action was failed!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ManageProfile;
