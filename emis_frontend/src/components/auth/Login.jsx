/**
 * Calling from: Auth.jsx 
 * Calling to: 
 */

import React, { useState } from 'react';
import axios from 'axios';
import Logo256 from '../../assets/logos/emis-256x256.png';
import API_BASE_URL from '../../utils/config';
import { saveLoginResponse } from '../../utils/auth';

const LoginComponent = ({ onLoginSuccess, username, setUsername, setActiveAuthComponet }) => {
    // const [email, setEmail] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showResendVerificationButton, setShowResendVerificationButton] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login/`, {
                username: username,
                password: password,
            });

            if (response.status === 200) {
                // Login successful
                // Save the login response data in cookie 
                saveLoginResponse(response.data);

                // Call the onLoginSuccess function passed as prop from App.jsx to change log state
                onLoginSuccess();
            }
        } catch (error) {
            // console.log(error);
            // Handle login error
            if (error.code === "ERR_NETWORK") {
                setError("Network Error. It's our fault!");
            } else if (error.response.status && error.response.status === 403 && error.response.data.email_verified === false) {
                // Email not verified
                setError(error.response.data.message);
                // Show the re-send email verification link
                setShowResendVerificationButton(true);
            } else if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="card bg-transparent">
                <div className="text-center">
                    <i className="bi bi-door-closed text-beige fs-1"></i>
                </div>
                    <div className='w-350'>
                        <form onSubmit={handleLogin}>
                            <div className="form-floating m-2 text-center">
                                <h1 className="h3 mb-3 fs-3 text-white">Please sign in</h1>
                            </div>
                            <div className="form-floating m-2 w-100">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="floatingUsernameInput"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingUsernameInput">Username</label>
                            </div>
                            <div className="form-floating m-2 w-100">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            {/* Error alert */}
                            {error && (
                                <div className="alert text-bg-warning alert-dismissible fade show m-2 w-100" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill"></i> &nbsp;
                                    <strong>{error}</strong>
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setTimeout(() => setError(''), 0)}></button>
                                </div>
                            )}
                            {/* Error alert */}
                            {showResendVerificationButton && (
                                <div className="alert text-bg-light alert-dismissible fade show  m-2 p-0 w-100" role="alert">
                                    <button type="button" className="btn-close p-2 pt-3" data-bs-dismiss="alert" aria-label="Close" onClick={() => setTimeout(() => setError(''), 0)}></button>
                                    <button type='button' className='btn' onClick={() => setActiveAuthComponet('ResendVerificationEmail')}>
                                        <i className="bi bi-envelope-at"></i> &nbsp;
                                        <strong>Resend Verification Email</strong>
                                    </button>
                                </div>
                            )}
                            <div className="text-center form-floating m-2 w-100 my-4">
                                <button className="btn btn-primary w-75 py-2" type="submit">
                                    Sign in
                                </button>
                                <a className="btn text-info m-3" onClick={() => setActiveAuthComponet('ResetPassword')}> Forgot password? Reset here. </a>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    );
};

export default LoginComponent;
