import React, { useState } from 'react';
import { getProfileData, getFileLink, getUserId, getAccessToken, setProfileData, getUserRole } from '../../utils/auth';
import BootstrapPhone from '../sub-components/BootstrapPhone2';
import FileUploadForm from '../file-handler/FileUploadForm';
import { deleteFile } from '../file-handler/fileUtils';
import API_BASE_URL from '../../utils/config';
import axios from 'axios';


const AdditionalStaffZone = () => {
    const initProfile = getProfileData();
    const role = getUserRole();
    const [profile, setProfile] = useState(initProfile);
    const [updatedProfile, setUpdatedProfile] = useState(profile);
    const [phoneError, setPhoneError] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [nidError, setNidError] = useState(false);
    const [fileID, setFileID] = useState('');
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [showUpdateFailed, setShowUpdateFailed] = useState(false);



    const handlePhoneChange = (phone) => {
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            phone: phone
        }));
        setPhoneError(false); // Reset the phone error when the phone number changes
        // setShowUpdateSuccess(false);
        // setShowUpdateFailed(false);
    };

    const validatePhoneNumber = () => {
        const { phone } = updatedProfile;
        // only validate Bangladeshi numbers 
        if (phone.startsWith('+880') || phone.startsWith('880') || phone.startsWith('0')) {
            const pattern = /^(?:\+?880|0|88)?\s?1[3456789]\d{8}$/;
            if (!pattern.test(phone)) {
                setPhoneError(true);
            } else {
                setPhoneError(false);
            }
        }
    };

    const validateNID = () => {
        const { nid } = updatedProfile;
        const nidLength = nid.length;
        setNidError(nidLength < 10 || nidLength > 17);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
        setShowUpdateSuccess(false);
        setShowUpdateFailed(false);
    };

    async function deleteFileById(file_id) {
        if (file_id) {
            try {
                const del = await deleteFile(file_id);
                // Handle the deletion success 
            } catch (error) {
                // Handle the error
                console.error('Error deleting file:', error);
            }
        }
    }



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

    const cancelUpdate = () => {
        setUpdatedProfile(initProfile);
    };

    const handleDeletePhoto = () => {
        // Check if a new photo was uploaded
        if (initProfile.photo_id !== updatedProfile.photo_id) {
            // Delete the new photo
            deleteFileById(updatedProfile.photo_id);
            // Update the profile with the appropriate photo_id
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                photo_id: initProfile.photo_id
            }));
            setProfile((prevProfile) => ({
                ...prevProfile,
                photo_id: initProfile.photo_id
            }));
        } else {
            // Delete the old photo
            deleteFileById(initProfile.photo_id);
            // Update the profile with the appropriate photo_id
            setUpdatedProfile((prevProfile) => ({
                ...prevProfile,
                photo_id: ''
            }));
            setProfile((prevProfile) => ({
                ...prevProfile,
                photo_id: ''
            }));
        }

        setProfileData(profile);
        setFileID('');
        setShowUpdateSuccess(false);
        setShowUpdateFailed(false);
    };

    const onFileUpload = (file_id, file_link) => {
        // in case of re-upload, delete the prevous one. 
        if (initProfile.photo_id !== updatedProfile.photo_id) {
            deleteFileById(updatedProfile.photo_id)
        }
        setFileID(file_id);
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            photo_id: file_id
        }));
        setShowUpdateSuccess(false);
        setShowUpdateFailed(false);
    }

    const handleUpdate = () => {
        const accessToken = getAccessToken();
        const formDataToSend = new FormData();
        Object.entries(updatedProfile).forEach(([key, value]) => {
            if (initProfile[key] !== value) {
                formDataToSend.append(key, value);
            }
        });

        formDataToSend.append('updated_by', getUserId());
        formDataToSend.delete('updated_at');
        // console.log([...formDataToSend]);
        axios
            .patch(`${API_BASE_URL}/${role}/update-partial/${profile.id}/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setProfile(response.data);
                setProfileData(response.data);
                setShowUpdateSuccess(true);

                // Check if a new photo was uploaded and the previous photo exists
                if (formDataToSend.has('photo_id') && initProfile.photo_id) {
                    // Delete the old photo
                    deleteFileById(initProfile.photo_id);
                }
            })
            .catch((error) => {
                console.error(error);
                setShowUpdateFailed(true);
            });
    };

    return (
        <div>
            {profile &&
                <div className="row bg-white border rounded-3 my-4">

                    <div className="col-md-3 border-right">
                        <div className="p-3 py-5 my-1">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-secondary fs-4 md-mx-auto">Additional</h4>
                            </div>
                        </div>

                        <div style={divStyle} className="border rounded-3 bg-light mx-auto">
                            {updatedProfile.photo_id ? (
                                <img
                                    src={getFileLink(updatedProfile.photo_id)}
                                    style={{ width: '100%', height: '100%' }}
                                    className="rounded-3"
                                    alt="Profile Photo" />
                            ) : (
                                <div className=''><i className="bi bi-person-bounding-box fs-1"></i></div>
                            )}
                        </div>
                        <div className="d-flex justify-content-center my-2 border mx-auto py-2 rounded-3 bg-light" style={{ maxWidth: '200px' }}>
                            <button className="btn btn-danger p-0 px-2 me-1" onClick={handleDeletePhoto}>Delete</button>
                            <FileUploadForm onFileUpload={onFileUpload} accept_type='image' className="pt-2" />
                        </div>
                    </div>

                    <div className="col-md-9">
                        <div className="p-md-3 py-md-5">
                            <div className="row my-2">
                                <div className="col-md-6">
                                    <label className="text-secondary labels">Phone</label>
                                    {phoneError && (
                                        <div className="alert alert-danger" role="alert">
                                            Please input a valid phone number.
                                        </div>
                                    )}
                                    <BootstrapPhone value={updatedProfile.phone} onChange={handlePhoneChange} setIsPhoneValid={setIsPhoneValid} />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">NID</label>
                                    {updatedProfile.nid === '' ?
                                        (<div id="nid-note" className="text-info ms-2" role="alert">
                                            NID number should be between 10 to 17.
                                        </div>) :
                                        (nidError) && (
                                            <div id="nid-note" className="alert alert-danger" role="alert">
                                                NID number is not valid. It should be between 10 and 17 digits long.
                                            </div>
                                        )}
                                    <input type="number" className="form-control" id="nid" name="nid" value={updatedProfile.nid} onBlur={validateNID} onInput={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3 my-4">
                                <label className="text-secondary labels">Gender </label>
                                <div className="form-check mx-4">
                                    <input type="radio" className="form-check-input" id="gender-male" name="gender" value="M" checked={updatedProfile.gender === 'M'} onChange={handleChange} required />
                                    <label htmlFor="gender-male" className="form-check-label">Male</label>
                                </div>
                                <div className="form-check mx-4">
                                    <input type="radio" className="form-check-input" id="gender-female" name="gender" value="F" checked={updatedProfile.gender === 'F'} onChange={handleChange} required />
                                    <label htmlFor="gender-female" className="form-check-label">Female</label>
                                </div>
                                <div className="form-check mx-4">
                                    <input type="radio" className="form-check-input" id="gender-other" name="gender" value="O" checked={updatedProfile.gender === 'O'} onChange={handleChange} required />
                                    <label htmlFor="gender-other" className="form-check-label">Other</label>
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">Birth Date</label>
                                    <input type="date" className="form-control" id="birth_date" name="birth_date" value={updatedProfile.birth_date} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">Father's Name</label>
                                    <input type="text" className="form-control" id="father_name" name="father_name" value={updatedProfile.father_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">Mother's Name</label>
                                    <input type="text" className="form-control" id="mother_name" name="mother_name" value={updatedProfile.mother_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">Present Address</label>
                                    <textarea type="textarea" className="form-control" id="present_address" name="present_address" value={updatedProfile.present_address} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="row my-4">
                                <div className="col-md-12">
                                    <label className="text-secondary labels">Permanent Address</label>
                                    <textarea type="textarea" className="form-control" id="permanent_address" name="permanent_address" value={updatedProfile.permanent_address} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mt-5 text-center my-3">
                                {showUpdateSuccess &&
                                    <div className="alert alert-info fw-bold text-darkblue alert-dismissible fade show" role="alert">
                                        <i className="bi bi-check2-circle"></i> Updated Successfully
                                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>}
                                {showUpdateFailed &&
                                    <div className="alert alert-info fw-bold alert-dismissible fade show" role="alert">
                                        <i className="bi bi-x-octagon"></i> Update Failed
                                        <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>}
                                <div className="d-grid gap-2">
                                    <button onClick={handleUpdate} className="btn btn-darkblue pt-1 profile-button" type="button" disabled={!isPhoneValid}>Update</button>
                                    <button onClick={cancelUpdate} className="btn btn-darkblue pt-1 profile-button" type="button">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>}
        </div>
    );
}


export default AdditionalStaffZone;
