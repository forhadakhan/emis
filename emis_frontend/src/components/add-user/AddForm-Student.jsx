/**
 * Calling From: AddStudent.jsx
 * Calling To: BootstrapPhone.jsx; FileUploadForm.jsx; 
 */

import React, { useState, useEffect } from 'react';
import 'react-international-phone/style.css';
import { deleteFile } from '../file-handler/fileUtils';
import { getAccessToken, getUserId, getFileLink } from '../../utils/auth';
import BootstrapPhone from '../sub-components/BootstrapPhone';
import FileUploadForm from '../file-handler/FileUploadForm';
import axios from 'axios';


const AddForm = ({ formFields, url }) => {
    const [formData, setFormData] = useState(formFields);
    const [passwordError, setPasswordError] = useState('');
    const [re_password, setRePassword] = useState('');
    const [phone, setPhone] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [guardianPhoneError, setGuardianPhoneError] = useState(false);
    const [editStatus, setEditStatus] = useState(true);
    const [nidError, setNidError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [uploadedFileId, setUploadedFileId] = useState('');
    const [uploadedFileLink, setUploadedFileLink] = useState('');


    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            phone: phone,
            guardian_phone: guardianPhone,
        }));
    }, [phone, guardianPhone]);

    const handlePhoneChange = (phone) => {
        setPhone(phone);
        setPhoneError(false); // Reset the phone error when the phone number changes
    };

    const handleGuardianPhoneChange = (phone) => {
        setGuardianPhone(phone);
        setGuardianPhoneError(false); // Reset the phone error when the phone number changes
    };

    const validatePhoneNumber = () => {
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

    const validateGuardianPhoneNumber = () => {
        // only validate Bangladeshi numbers 
        if (phone.startsWith('+880') || phone.startsWith('880') || phone.startsWith('0')) {
            const pattern = /^(?:\+?880|0|88)?\s?1[3456789]\d{8}$/;
            if (!pattern.test(phone)) {
                setGuardianPhoneError(true);
            } else {
                setGuardianPhoneError(false);
            }
        }
    };

    const validateNID = () => {
        const nidLength = formData.nid.length;
        setNidError(nidLength < 10 || nidLength > 17);
    }

    const validatePassword = () => {
        if (formData.user.password !== re_password) {
            setPasswordError('Passwords do not match');
            return;
        }
        setPasswordError('');
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            user: {
                ...prevData.user,
                [name]: value,
            },
        }));
    };


    const onFileUpload = (file_id, file_link) => {
        setUploadedFileId(file_id);
        setUploadedFileLink(file_link);
        setFormData((prevData) => ({
            ...prevData,
            photo_id: file_id,
        }));
    }


    const handleReview = () => {
        if (formData.photo_id && formData.photo_id.size > 300 * 1024) {
            // File size exceeds the limit
            setSelectedFile(null);
            return;
        }
        validateNID();
        validatePhoneNumber();

        const allValid = passwordError === '' && !nidError && !phoneError;
        if (!allValid) { return }

        // console.log(formData);

        setEditStatus(false);
    };

    const handleEdit = () => {
        setAlertMessage('')
        setEditStatus(true)
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

    const handleReset = () => {
        setFormData(formFields);
        setPhone('');
        deleteFileById(uploadedFileId);
    };

    const handleAddAnother = () => {
        handleEdit();
        handleReset();
        setSubmitSuccess(false);
        setIsLoading(false);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const accessToken = getAccessToken();
        const formDataToSend = new FormData();
        for (const key in formData) {
            if (key === 'user') {
                const userObj = formData[key];
                userObj.email = userObj.email.toLowerCase();
                userObj.username = userObj.username.toLowerCase();
                formDataToSend.append(key, JSON.stringify(userObj));
            } else if (key === 'email' || key === 'username') {
                formDataToSend.append(key, formData[key].toLowerCase());
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        const added_by = getUserId();
        formDataToSend.append('added_by', added_by);
        if (uploadedFileId) {
            formDataToSend.set('photo_id', uploadedFileId);
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            },
        };
        setIsLoading(true);
        axios
            .post(url, formDataToSend, config)
            .then((response) => {
                setAlertMessage('Data saved successfully.');
                setSubmitSuccess(true)
            })
            .catch((error) => {
                // console.error(error);
                setIsLoading(false);
                if (error.response && error.response.data) {
                    const errorMessages = Object.values(error.response.data)
                        .flatMap((errorArray) => errorArray)
                        .join('\n');

                    if (errorMessages) {
                        setAlertMessage(`Failed to submit data, \n${errorMessages}`);
                    } else {
                        setAlertMessage('Failed to submit data. Please try again.');
                    }
                } else {
                    setAlertMessage('Failed to submit data. Please try again.');
                }
            });
    };

    const reviewDisable = () => {
        return (formData.username === '' || formData.email === '' || formData.nid.length < 10 || formData.first_name === '')
    }


    return (
        <div>
            {editStatus ? (
                <div id="form-edit" className="border border-beige rounded-4 p-3 m-4">
                    <form className="mw-750 mx-auto my-5">
                        <div className="mb-3 my-4">
                            <label htmlFor="username" className="form-label h5 ">Username   * </label>
                            <input type="text" className="form-control fs-5" id="username" name="username" value={formData.user.username} onChange={handleUserChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="email" className="form-label h5 ">Email * </label>
                            <input type="email" className="form-control fs-5" id="email" name="email" value={formData.user.email} onChange={handleUserChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label className="form-label h5  me-2">Gender * </label>
                            <div className="form-check mx-4 fs-5">
                                <input type="radio" className="form-check-input" id="gender-male" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleChange} required />
                                <label htmlFor="gender-male" className="form-check-label">Male</label>
                            </div>
                            <div className="form-check mx-4 fs-5">
                                <input type="radio" className="form-check-input" id="gender-female" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleChange} required />
                                <label htmlFor="gender-female" className="form-check-label">Female</label>
                            </div>
                            <div className="form-check mx-4 fs-5">
                                <input type="radio" className="form-check-input" id="gender-other" name="gender" value="O" checked={formData.gender === 'O'} onChange={handleChange} required />
                                <label htmlFor="gender-other" className="form-check-label">Other</label>
                            </div>
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="first_name" className="form-label h5 ">First Name * </label>
                            <input type="text" className="form-control fs-5" id="first_name" name="first_name" value={formData.user.first_name} onChange={handleUserChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="middle_name" className="form-label h5 ">Middle Name</label>
                            <input type="text" className="form-control fs-5" id="middle_name" name="middle_name" value={formData.user.middle_name} onChange={handleUserChange} />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="last_name" className="form-label h5 ">Last Name * </label>
                            <input type="text" className="form-control fs-5" id="last_name" name="last_name" value={formData.user.last_name} onChange={handleUserChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="birth_date" className="form-label h5 ">Birth Date * </label>
                            <input type="date" className="form-control fs-5" id="birth_date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="nid" className="form-label h5 ">NID * </label>

                            {formData.nid === '' ?
                                (<div id="nid-note" className="text-info ms-2" role="alert">
                                    NID number should be between 10 to 17.
                                </div>) :
                                (nidError) && (
                                    <div id="nid-note" className="alert alert-danger" role="alert">
                                        NID number is not valid. It should be between 10 and 17 digits long.
                                    </div>
                                )}

                            <input type="number" className="form-control fs-5" id="nid" name="nid" value={formData.nid} onBlur={validateNID} onInput={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="photo" className="form-label h5 ">Photo</label>
                            <div className="input-group" role="group" aria-label="Photo Upload">
                                <FileUploadForm onFileUpload={onFileUpload} accept_type='image' />
                                {uploadedFileId ? (
                                    <a href={getFileLink(uploadedFileId)} target='_blank' rel='noopener noreferrer' className="btn btn-beige ms-2">New file uploaded</a>
                                ) : (<span className="ms-3 pt-1">No file selected</span>)}
                            </div>
                        </div>
                        <div className="mb-3 my-4 input-group">
                            <label htmlFor="phone" className="form-label h5 me-4">
                                Phone *
                            </label>
                            {phoneError && (
                                <div className="alert alert-danger" role="alert">
                                    Please input a valid phone number.
                                </div>
                            )}
                            <BootstrapPhone value={phone} onChange={handlePhoneChange} onBlur={validatePhoneNumber} />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="father_name" className="form-label h5 ">Father's Name * </label>
                            <input type="text" className="form-control fs-5" id="father_name" name="father_name" value={formData.father_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="mother_name" className="form-label h5 ">Mother's Name * </label>
                            <input type="text" className="form-control fs-5" id="mother_name" name="mother_name" value={formData.mother_name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="guardian_name" className="form-label h5 ">Guardian's Name </label>
                            <input type="text" className="form-control fs-5" id="guardian_name" name="guardian_name" value={formData.guardian_name} onChange={handleChange} />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="guardian_relationship" className="form-label h5 ">Guardian's Relationship </label>
                            <input type="text" className="form-control fs-5" id="guardian_relationship" name="guardian_relationship" value={formData.guardian_relationship} onChange={handleChange} />
                        </div>
                        <div className="mb-3 my-4 input-group">
                            <label htmlFor="guardian_phone" className="form-label h5 me-4">
                                Guardian's Phone 
                            </label>
                            {guardianPhoneError && (
                                <div className="alert alert-danger" role="alert">
                                    Please input a valid phone number.
                                </div>
                            )}
                            <BootstrapPhone value={guardianPhone} onChange={handleGuardianPhoneChange} onBlur={validateGuardianPhoneNumber} />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="guardian_email" className="form-label h5 ">Guardian's Email </label>
                            <input type="email" className="form-control fs-5" id="guardian_email" name="guardian_email" value={formData.guardian_email} onChange={handleChange} />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="permanent_address" className="form-label h5 ">Permanent Address * </label>
                            <textarea type="textarea" className="form-control fs-5" id="permanent_address" name="permanent_address" value={formData.permanent_address} onChange={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="present_address" className="form-label h5 ">Present Address * </label>
                            <textarea type="textarea" className="form-control fs-5" id="present_address" name="present_address" value={formData.present_address} onChange={handleChange} required />
                        </div>
                        <div className="mb-3 my-4">
                            <label htmlFor="password" className="form-label h5 ">Password * </label>
                            <input type="password" className="form-control fs-5" id="password" name="password" value={formData.user.password} onChange={handleUserChange} required />
                        </div>
                        {/* <div className="mb-3 my-4">
                            <label htmlFor="re_password" className="form-label h5 ">Confirm Password * </label>
                            <input type="password" className="form-control fs-5" id="re_password" name="re_password" value={re_password} onBlur={validatePassword} onChange={() => setRePassword} required />
                        </div> */}
                        {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                        <div className="d-grid gap-2 m-4">
                            {!(passwordError === '' && !nidError && !phoneError) && (
                                <div id="false-data" className="alert alert-warning" role="alert">
                                    You inputed invalid data, please check again.
                                </div>
                            )}
                            <button type="button" className="btn btn-darkblue btn-lg p-2 m-2 pt-1" onClick={handleReview} disabled={reviewDisable()}><i className="bi bi-bullseye"></i> Review</button>
                            <button type="reset" className="btn btn-darkblue btn-lg p-2 m-2 pt-1" onClick={handleReset}><i className="bi bi-x-circle-fill"></i> Reset</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div id="form-review" className="bg-white border border-beige rounded-4 p-3">
                    <h3 className="text-center p-2 bg-beige border border-darkblue rounded-2 fs-5 m-4 ">Review Information</h3>
                    <table className="table mw-750 mx-auto my-4">
                        <tbody>
                            {Object.entries(formData).map(([key, value]) => {
                                if (key === 'user') {
                                    return Object.entries(formData.user).map(([subKey, subValue]) => {
                                        if (subKey === 'password' || subKey === 're_password') {
                                            // Exclude password and re_password fields
                                            return null;
                                        }
                                        return (
                                            <tr key={subKey}>
                                                <td className="text-uppercase text-end fw-bold">{subKey.replace(/_/g, ' ')}</td>
                                                <td className="fs-5">{subValue}</td>
                                            </tr>
                                        );
                                    });
                                }
                                if (key === 'gender') {
                                    switch (value) {
                                        case 'M':
                                            return (
                                                <tr key="gender">
                                                    <td className="text-uppercase text-end fw-bold">GENDER</td>
                                                    <td className="fs-5">Male</td>
                                                </tr>
                                            );
                                        case 'F':
                                            return (
                                                <tr key="gender">
                                                    <td className="text-uppercase text-end fw-bold">GENDER</td>
                                                    <td className="fs-5">Female</td>
                                                </tr>
                                            );
                                        case 'O':
                                            return (
                                                <tr key="gender">
                                                    <td className="text-uppercase text-end fw-bold">GENDER</td>
                                                    <td className="fs-5">Other</td>
                                                </tr>
                                            );
                                        default:
                                            return null;
                                    }
                                }
                                return (
                                    <tr key={key}>
                                        <td className="text-uppercase text-end fw-bold">{key.replace(/_/g, ' ')}</td>
                                        <td className="fs-5">
                                            {key === 'photo_id' && value ? (

                                                <img
                                                    src={getFileLink(uploadedFileId)}
                                                    alt="Photo"
                                                    className="rounded-3"
                                                    style={{ maxWidth: '250px' }}
                                                />

                                            ) : (
                                                value
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="d-grid gap-2 m-5 px-5 mw-750 mx-auto">
                        {alertMessage && <div id="photo-note" className="alert alert-info mx-auto fw-bold" role="alert">{alertMessage}</div>}
                        {submitSuccess ? (
                            <button type="button" className="btn btn-darkblue btn-lg p-2 m-2 pt-1" onClick={handleAddAnother}>
                                <i className="bi bi-plus-circle"></i> Add Another
                            </button>
                        ) : (
                            <>
                                <button type="button" className="btn btn-darkblue btn-lg p-2 m-2 pt-1" onClick={handleEdit}>
                                    <i className="bi bi-pencil-square"></i> Edit
                                </button>
                                <button type="submit" className="btn btn-darkblue btn-lg p-2 m-2 pt-1" onClick={handleSubmit}>
                                    {isLoading ? (
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>) : (<div><i className="bi bi-person-bounding-box"></i> Save</div>)}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


export default AddForm; 
