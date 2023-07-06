/**
 * Parent: ManageProfile.jsx;
 */

import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId } from '../../../utils/auth';


const ManageProfileUserForm = ({ data, related_to, status }) => {
    const [isReadonly, setIsReadonly] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const loggedUser = getUserId();

    function convertDate(dateString) {
        if (dateString) {
            const date = new Date(dateString);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        } else {
            return '';
        }
    }
    const [source, setSource] = useState({
        username: data.username,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        is_staff: data.is_staff,
        is_active: data.is_active,
        id: data.id,
    });
    const [formData, setFormData] = useState(source);

    const [fixedData] = useState({
        date_joined: convertDate(data.date_joined),
        last_login: convertDate(data.last_login),
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitch = (e) => {
        setFormData({ ...formData, [e.target.name]: !formData[e.target.name] });
    };

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
        formDataToSend.append('updated_by', loggedUser);

        axios.patch(`${API_BASE_URL}/user/update-partial/${data.id}/`, formDataToSend, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(response => {
            setShowSuccessModal(true);
            setSource(response.data);
        }).catch(error => {
            setShowErrorModal(true);
            console.error(error);
        });
    };

    return (
        <div>
            <form className='mw-750 mx-auto' >
                <div className="mb-3">
                    <label className="form-label h6 me-4">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Middle Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>

                {/* <div className="mb-3">
                    <label className="form-label h6 me-4" >Role</label>
                    <select className="form-select" name="role" onChange={handleChange} disabled={isReadonly} aria-label="role-select">
                        <option selected={formData.role === "staff"} value="staff">Staff</option>
                        <option selected={formData.role === "administrator"} value="administrator">Administrator</option>
                    </select>
                </div> */}

                <div className="my-4 input-group form-check-reverse form-switch text-start">
                    <label className="form-check-label form-label h6 me-4" htmlFor="flexStaffSwitchCheckChecked">
                        Staff Status  (readonly/fullaccess)
                    </label>
                    <input
                        className="form-check-input border p-2 rounded-3"
                        type="checkbox"
                        name="is_staff"
                        onChange={handleSwitch}
                        disabled={isReadonly}
                        checked={formData.is_staff}
                        id="flexStaffSwitchCheckChecked"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Date Joined</label>
                    <input
                        type="text"
                        className="form-control"
                        name="date_joined"
                        value={fixedData.date_joined}
                        disabled
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label h6 me-4">Last Login</label>
                    <input
                        type="text"
                        className="form-control"
                        name="last_login"
                        value={fixedData.last_login}
                        disabled
                    />
                </div>

                {isReadonly ? (
                    <div className="d-grid gap-2 m-5">
                        <button type="button" className="btn btn-darkblue pt-1" onClick={() => setIsReadonly(false)}><i className="bi bi-pencil-square"></i> Edit</button>
                    </div>
                ) : (
                    <div className="d-grid gap-2 m-5">
                        <button type="button" onClick={handleSubmit} className="btn btn-darkblue"><i className="bi bi-person-bounding-box"></i> Update</button>
                        <button type="button" className="btn btn-darkblue pt-1" onClick={() => { setIsReadonly(true); setFormData(source); }}><i className="bi bi-clipboard-x"></i> Cancel</button>
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



export default ManageProfileUserForm;
