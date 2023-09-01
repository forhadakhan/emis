/**
 * Call From: ManageTeacherProfile.jsx;
 * Call To: BootstrapPhone.jsx; FileUploadForm.jsx;
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId, getFileLink } from '../../../utils/auth';
import { convertDate } from '../../../utils/utils';
import { deleteFile } from '../../file-handler/fileUtils';
import BootstrapPhone from '../../sub-components/BootstrapPhone2'
import FileUploadForm from '../../file-handler/FileUploadForm'


const ManageProfileOthersForm = ({ data, full_name, username, related_to }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isReadonly, setIsReadonly] = useState(true);
    const [uploadedFileId, setUploadedFileId] = useState('');
    const [uploadedFileLink, setUploadedFileLink] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    const [source, setSource] = useState({
        acronym: data.acronym,
        gender: data.gender,
        permanent_address: data.permanent_address,
        present_address: data.present_address,
        nid: data.nid,
        photo_id: data.photo_id,
        phone: data.phone,
        birth_date: data.birth_date,
        father_name: data.father_name,
        mother_name: data.mother_name,
    });

    const [formData, setFormData] = useState(source);

    const [fixedData, setFixedData] = useState({
        updated_at: convertDate(data.updated_at),
        added_by: data.added_by,
        updated_by: data.updated_by,
    });


    const onFileUpload = (file_id, file_link) => {
        setUploadedFileId(file_id);
        setUploadedFileLink(file_link);
        setFormData((prevData) => ({
            ...prevData,
            photo_id: file_id,
        }));
    }


    const [history, setHistory] = useState(data.history);
    const [phoneError, setPhoneError] = useState(false);
    const [phone, setPhone] = useState(formData.phone);

    useEffect(() => {
        setFormData((formData) => ({
            ...formData,
            phone: phone,
        }));
    }, [phone]);

    const handlePhoneChange = (phone) => {
        setPhone(phone);
        setPhoneError(false); // Reset the phone error when the phone number changes
    };

    const validatePhoneNumber = () => {
        if (phone.startsWith('+880') || phone.startsWith('880') || phone.startsWith('0')) {
            const pattern = /^(?:\+?880|0|88)?\s?1[3456789]\d{8}$/;
            if (!pattern.test(phone)) {
                setPhoneError(true);
            } else {
                setPhoneError(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function deleteFileById(file_id) {
        if (file_id) {
            try {
                const del = await deleteFile(file_id);
                // Handle the deletion success 
                setUploadedFileId('');
                setUploadedFileLink('');
                setFormData((prevData) => ({
                    ...prevData,
                    photo_id: '',
                }));
            } catch (error) {
                // Handle the error
                console.error('Error deleting file:', error);
            }
        }
    }

    const handleCancel = () => {
        setIsReadonly(true);
        setFormData(source);
        setPhone(source.phone);
        deleteFileById(uploadedFileId);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const accessToken = getAccessToken();
        const updatedData = formData;

        const formDataToSend = new FormData();
        Object.entries(updatedData).forEach(([key, value]) => {
            if (source[key] !== value) {
                formDataToSend.append(key, value);
            }
        });

        formDataToSend.append('updated_by', getUserId());
        formDataToSend.delete('updated_at');

        axios.patch(`${API_BASE_URL}/teacher/update-partial/${related_to}/`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        }).then((response) => {
            setShowSuccessModal(true);
            setSource(response.data);
            if (formDataToSend.has('photo_id') && data.photo_id) {
                // Delete old photo
                deleteFileById(data.photo_id)
            }
        }).catch((error) => {
            setShowErrorModal(true);
            console.error(error);
        });
    };


    return (
        <div>
            <form className='mw-750 mx-auto'>

                <div className="card my-5">
                    <div className="row g-0">
                        <div className="col-md-3">
                            {formData.photo_id ? (
                                <img src={getFileLink(formData.photo_id)} className="img-fluid rounded-start mx-auto d-flex" alt="..." />
                            ) : (
                                <div className="rounded-start-2 mx-auto bg-darkblue text-beige" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }}>
                                    <i className="bi bi-person-bounding-box fs-1"></i>
                                </div>
                            )}
                        </div>
                        <div className="col-md-9">
                            <div className="card-body ms-3">
                                <h4 className="card-title">{full_name}</h4>
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-person-fill"></i> {username}</h5>
                                <p className="text-secondary fw-light py-2">Added by <em>"{fixedData.added_by}"</em> <br />
                                    Updated by <em>"{fixedData.updated_by}"</em> at <em>{fixedData.updated_at}</em></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Acronym</label>
                    <input
                        type="text"
                        className="form-control"
                        name="acronym"
                        value={formData.acronym}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Father's Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="father_name"
                        value={formData.father_name}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Mother's Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mother_name"
                        value={formData.mother_name}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">NID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nid"
                        value={formData.nid}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3 my-4">
                    <label className="form-label h6 me-4">Gender * </label>
                    <div className="form-check mx-4 fs-6">
                        <input type="radio" disabled={isReadonly} className="form-check-input" id="gender-male" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleChange} required />
                        <label htmlFor="gender-male" className="form-check-label">Male</label>
                    </div>
                    <div className="form-check mx-4 fs-6">
                        <input type="radio" disabled={isReadonly} className="form-check-input" id="gender-female" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleChange} required />
                        <label htmlFor="gender-female" className="form-check-label">Female</label>
                    </div>
                    <div className="form-check mx-4 fs-6">
                        <input type="radio" disabled={isReadonly} className="form-check-input" id="gender-other" name="gender" value="O" checked={formData.gender === 'O'} onChange={handleChange} required />
                        <label htmlFor="gender-other" className="form-check-label" >Other</label>
                    </div>
                </div>


                {phoneError && (
                    <div className="alert alert-danger" role="alert">
                        Please input a valid phone number.
                    </div>
                )}
                <div className="mb-3 my-4 input-group">
                    <label htmlFor="phone" className="form-label h6 me-4">
                        Phone *
                    </label>
                    <BootstrapPhone disabled={isReadonly} value={phone} onChange={handlePhoneChange} setIsPhoneValid={setIsPhoneValid} />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Birth Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Permanent Address</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        name="permanent_address"
                        id="permanent_address"
                        value={formData.permanent_address}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Present Address</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        name="present_address"
                        id="present_address"
                        value={formData.present_address}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3 my-4">
                    <label htmlFor="photo" className="form-label h5 ">Photo</label>
                    <div className="input-group" role="group" aria-label="Photo Upload">
                        <FileUploadForm onFileUpload={onFileUpload} accept_type='image' deactive={isReadonly} />
                        {uploadedFileId ? (
                            <a href={getFileLink(uploadedFileId)} target='_blank' rel='noopener noreferrer' className="btn btn-beige ms-2">New file uploaded</a>
                        ) : (<span className="ms-3 pt-1">  </span>)}
                    </div>
                </div>


                {isReadonly ? (
                    <div className="d-grid gap-2 m-5">
                        <button type="button" id="edit" className="btn btn-darkblue pt-1" onClick={() => setIsReadonly(false)}><i className="bi bi-pencil-square"></i> Edit</button>
                    </div>
                ) : (
                    <div className="d-grid gap-2 m-5">
                        <button type="button" className="btn btn-darkblue" onClick={handleSubmit} disabled={!isPhoneValid}><i className="bi bi-person-bounding-box"></i> Update</button>
                        <button type="button" className="btn btn-darkblue pt-1" onClick={handleCancel}>
                            <i className="bi bi-clipboard-x"></i> Cancel
                        </button>

                    </div>
                )}
            </form>

            {showSuccessModal && (
                <div className="bg-blur">
                    <div className={`modal ${showSuccessModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-darkblue border border-beige text-beige">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-check-circle-fill"></i> Saved </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={() => { setShowSuccessModal(false), setIsReadonly(true) }}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                    Update was successful!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showErrorModal && (
                <div className="bg-blur">
                    <div className={`modal ${showErrorModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showErrorModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-danger border border-beige text-white">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-exclamation-octagon-fill"></i> Failed </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={() => { setShowErrorModal(false) }}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                    Not updated, action was failed!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageProfileOthersForm;
