import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config';


const ResendVerificationEmail = ({ username, setUsername, setActiveAuthComponet }) => {
    const [resendEmailMessage, setResendEmailMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const handleResendEmail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/email/resend-verification/`, {
                username: username,
            });

            if (response.data.message) {
                setResendEmailMessage(response.data.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                setResendEmailMessage(error.response.data.message);
            } else if (error.code === "ERR_NETWORK") {
                setResendEmailMessage("Network Error. It's our fault!");
            } else {
                setResendEmailMessage("An error occurred. Please try again/later.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="d-flex align-items-center justify-content-center">
                <div className="card bg-transparent">
                    <div className="text-center">
                        <i className="bi bi-envelope text-beige fs-1"></i>
                    </div>
                    <form>
                        <div className="form-floating m-2 text-center mb-4">
                            <h1 className="h3 mb-3 fs-3 text-white">Send Verification Email</h1>
                        </div>
                        <div className="form-floating m-2">
                            <input
                                type="text"
                                className="form-control bg-warning-subtle"
                                id="floatingUsernameInput"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="floatingUsernameInput">Username</label>
                        </div>
                        <div className="text-center my-4">
                            <p className="text-center text-info">{resendEmailMessage}</p>
                        </div>
                        <div className="text-center my-4">
                            <button className="btn btn-primary w-75 py-2" type="button" onClick={handleResendEmail}>
                                {isLoading ? (
                                    <div class="d-flex justify-content-center">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>) : (<div> Send </div>)}
                            </button>
                        </div>
                        <div className="text-center my-4">
                            <button className="btn btn-outline-light w-75 py-2" type="button" onClick={() => setActiveAuthComponet('LoginComponent')}>
                                <i className="bi bi-back"></i> Back to sign in 
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResendVerificationEmail;
