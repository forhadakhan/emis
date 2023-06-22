import React, {useState} from 'react';
import { getUserData, getUserId, getAccessToken, setUserData } from '../../auth';
import API_BASE_URL from '../../config';
import axios from 'axios';


const GeneralZone = () => {
    const user = getUserData();
    const [updatedUser, setUpdatedUser] = useState(user);
    const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
    const [showUpdateFailed, setShowUpdateFailed] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
        setShowUpdateSuccess(false);
        setShowUpdateFailed(false);
    };

    const handleCancel = () => {
        setUpdatedUser(user);
        setShowUpdateSuccess(false);
        setShowUpdateFailed(false);
    }
    
    const handleUpdate = () => {
        const accessToken = getAccessToken();
        const user_id = getUserId();
        const formDataToSend = new FormData();
        Object.entries(updatedUser).forEach(([key, value]) => {
            if (user[key] !== value) {
                formDataToSend.append(key, value);
            }
        });

        formDataToSend.append('updated_by', user_id);
        formDataToSend.delete('updated_at');
        formDataToSend.delete('username');
        // console.log([...formDataToSend]);
        axios
            .patch(`${API_BASE_URL}/user/update-partial/${user_id}/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response) => {
                setUpdatedUser(response.data);
                setUserData(response.data);
                setShowUpdateSuccess(true);
            })
            .catch((error) => {
                console.error(error);
                setShowUpdateFailed(true);
            });
    };

    return (
        <div className="row bg-white border rounded-3 my-4">

            <div className="col-md-3 border-right">
                <div className="p-3 py-5 my-1">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-secondary fs-4 md-mx-auto">General </h4>
                    </div>
                </div>
            </div>

            <div className="col-md-9">
                <div className="p-md-3 py-md-5">
                    <div className="row my-2">
                        <div className="col-md-6">
                            <label className="text-secondary labels">Username</label>
                            <input
                                type="text"
                                disabled
                                className="form-control"
                                placeholder="enter phone number"
                                value={updatedUser.username}
                            />
                        </div>
                    </div>
                    <div className="row my-4">
                        <div className="col-md-6">
                            <label className="text-secondary labels">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="first name"
                                value={updatedUser.first_name}
                                name="first_name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="text-secondary labels">Middle Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="middle name"
                                value={updatedUser.middle_name}
                                name="middle_name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="text-secondary labels">Surname</label>
                            <input
                                type="text"
                                className="form-control"
                                value={updatedUser.last_name}
                                placeholder="surname"
                                name="last_name"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row my-4">
                        <div className="col-md-12">
                            <label className="text-secondary labels">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="enter your email"
                                value={updatedUser.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="mt-5 text-center my-3">
                                {showUpdateSuccess && <div className="alert alert-info text-center fw-bold"><i className="bi bi-check2-circle"></i> Updated Successfully</div>}
                                {showUpdateFailed && <div className="alert alert-warning text-center fw-bold"><i className="bi bi-x-octagon"></i> Update Failed</div>} 
                        <div className="d-grid gap-2">
                            <button onClick={handleUpdate} className="btn btn-darkblue pt-1 profile-button" type="button">Update</button>
                            <button onClick={handleCancel} className="btn btn-darkblue pt-1 profile-button" type="button">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralZone;
