import React, { useState } from 'react';
import { getUserId, getAccessToken, getRefreshToken, logout } from '../../utils/auth';
import API_BASE_URL from '../../utils/config';
import axios from 'axios';



const DangerZone = () => {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordResponseMsg, setPasswordResponseMsg] = useState('');
    const [wantToDeactive, setWantToDeactive] = useState(false);


    const handleChangePassword = (e) => {
        if (password === rePassword) {
            // Passwords match, perform password change
            e.preventDefault();

            const sendData = {
                user_id: getUserId(),
                old_password: currentPassword,
                new_password: password,
            };

            const accessToken = getAccessToken();
            const url = `${API_BASE_URL}/change-password/`;
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            axios
                .post(url, sendData, config)
                .then((response) => {
                    setPassword('');
                    setRePassword('');
                    setCurrentPassword('');
                    setPasswordResponseMsg(response.data.message);
                    setPasswordMatch(true);
                })
                .catch((error) => {
                    // console.error(error);
                    setPasswordResponseMsg(error.response.data.message);
                });
            // console.log('Password changed!');
        } else {
            // Passwords don't match, show warning
            setPasswordMatch(false);
        }
    };

    const handleCurrentPasswordChange = (e) => {
        setCurrentPassword(e.target.value);
        setPasswordResponseMsg('');
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (password !== '') {
            setPasswordMatch(true);
        }
        setPasswordResponseMsg('');
    };

    const handleRePasswordChange = (e) => {
        setRePassword(e.target.value);
        setPasswordMatch(true);
        setPasswordResponseMsg('');
    };

    const handleCancelPassword = () => {
        setPassword('');
        setRePassword('');
        setCurrentPassword('');
        setPasswordResponseMsg('');
        setPasswordMatch(true);
    };

    const matchPassword = () => {
        if (password !== rePassword) {
            setPasswordMatch(false);
        }
    }

    const isButtonDisabled = () => {
        // Enable/disable the "Change Password" button based on password requirements
        return (
            password.length < 8 ||
            !/\d/.test(password) ||
            !/[a-zA-Z]/.test(password) ||
            !/[!@#$%^&*]/.test(password) ||
            password !== rePassword
        );
    };


    const handleSignOut = async () => {
        // Get the refresh token and send it to backend for blacklisting. 
        const refreshToken = getRefreshToken();
        try {
            const response = await axios.post(`${API_BASE_URL}/logout/`, {
                refresh_token: refreshToken,
            });
            // Logout from frontend by removing access_token from local storage
            logout();
            window.location.reload();
        }
        catch (error) {
            // Handle sign-out error
            console.error('Sign-out error', error);
        }
    };


    const handleDeactivation = (e) => {
        e.preventDefault();
        const accessToken = getAccessToken();
        const url = `${API_BASE_URL}/deactivate-me/`;
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        axios
            .post(url, {}, config)
            .then((response) => {
                // console.log(response.data);
                handleSignOut()
            })
            .catch((error) => {
                // console.error(error);
                console.error(error);
            });
    }



    return (
        <>
            <div className="row bg-white border rounded-3 my-4">

                <div className="col-md-3 border-right">
                    <div className="p-3 py-5 my-1">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-danger fs-4 md-mx-auto">Danger </h4>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="p-md-3 py-md-5">

                        <div className="row my-4">
                            <div className="col-md-12">
                                <label className="text-secondary labels">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder=""
                                    name="currentPassword"
                                    value={currentPassword}
                                    onChange={handleCurrentPasswordChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="row my-2">
                                <div className="col-md-6">
                                    <label className="text-secondary labels">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder=""
                                        name="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onBlur={() => setTimeout(() => matchPassword(), 0)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="text-secondary labels">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder=""
                                        name="re_password"
                                        value={rePassword}
                                        onChange={handleRePasswordChange}
                                        onBlur={() => setTimeout(() => matchPassword(), 0)}
                                        required
                                    />
                                </div>
                            </div>
                            {!passwordMatch && (
                                <div className="text-danger alert alert-warning">Passwords do not match!</div>
                            )}

                            <div className="alert alert-warning text-darkblue alert-dismissible fade show" role="alert">
                                {passwordResponseMsg === '' ? (
                                    <ul>
                                        <li>Passwords must be between eight to twenty characters.</li>
                                        <li>Passwords must be alphanumeric.</li>
                                        <li>Passwords must have a special character.</li>
                                    </ul>
                                ) : (
                                    <span>
                                        <i className="bi bi-info-square-fill"></i> {passwordResponseMsg}
                                    </span>
                                )}
                                <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>

                            <div className="mt-5 text-center my-3">
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-darkblue pt-1 profile-button"
                                        type="button"
                                        onClick={handleChangePassword}
                                        disabled={isButtonDisabled()}
                                    >
                                        Change Password
                                    </button>
                                    <button className="btn btn-darkblue pt-1 profile-button" type="button" onClick={handleCancelPassword}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="row my-5 bg-light p-3 m-2 rounded-3 border  pt-4">
                            <div className="col-md-8">
                                <p className="pt-1">You won't be able to login, if you deactivate your account. </p>
                            </div>
                            <div className="col-md-4 text-end">
                                <button className="btn btn-danger pt-1 profile-button" type="button" onClick={() => setWantToDeactive(true)}>Deactivate</button>
                            </div>


                            {wantToDeactive &&
                                <div className="container d-flex align-items-center justify-content-center my-3">
                                    <div className="alert alert-info" role="alert">
                                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                                            <h6 className='text-center me-4 my-auto'>Are  you sure to DEACTIVATE your account?</h6>
                                            <button type="button" className="btn btn-danger" onClick={(e) => { handleDeactivation(e) }}> Yes </button>
                                            <button type="button" className="btn btn-danger ms-2" onClick={() => setWantToDeactive(false)}> No </button>
                                        </div>
                                    </div>
                                </div>}

                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}

export default DangerZone;
