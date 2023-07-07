import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config';


const ResetPassword = ({ username, setUsername, setActiveAuthComponet }) => {
    const [activeComponet, setActiveComponet] = useState('');
    const [pinCode, setPinCode] = useState(null);
    const [resetEmailMessage2, setResetEmailMessage2] = useState('');

    const renderComponent = () => {
        switch (activeComponet) {
            case 'SetNewPassword':
                return <SetNewPassword username={username} setActiveAuthComponet={setActiveAuthComponet} />;
            case 'ConfirmPin':
                return <ConfirmPin pinCode={pinCode} resetEmailMessage2={resetEmailMessage2} setActiveComponet={setActiveComponet} />;
            case 'ResetEmail':
                return <ResetEmail username={username} setUsername={setUsername} setPinCode={setPinCode} setResetEmailMessage2={setResetEmailMessage2} setActiveComponet={setActiveComponet} />;
            default:
                return (
                    <ResetEmail username={username} setUsername={setUsername} setPinCode={setPinCode} setResetEmailMessage2={setResetEmailMessage2} setActiveComponet={setActiveComponet} />
                );
        }
    };

    return (
        <div>
            {renderComponent()}

            <div className="text-center my-4">
                <button className="btn text-info py-2" type="button" onClick={() => setActiveAuthComponet('LoginComponent')}>
                    <i className="bi bi-back"></i> Back to sign in
                </button>
            </div>
        </div>
    );
}


const SetNewPassword = ({ username, setActiveAuthComponet }) => {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordResponseMsg, setPasswordResponseMsg] = useState('');
    const [resetSuccessful, setResetSuccessful] = useState(false);


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

    const handleResetPassword = (e) => {
        if (password === rePassword) {
            // Passwords match, perform password change
            e.preventDefault();

            const sendData = {
                username: username,
                new_password: password,
            };

            const url = `${API_BASE_URL}/reset-password/`;

            axios
                .post(url, sendData)
                .then((response) => {
                    setPassword('');
                    setRePassword('');
                    setPasswordResponseMsg(response.data.message);
                    setPasswordMatch(true);
                    setResetSuccessful(true);
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

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="card bg-transparent">

                {resetSuccessful ? (
                    <div>
                        <div className="text-center">
                            <i className="bi bi-check-circle-fill text-beige fs-1"></i>
                        </div>
                        <div className='w-350'>
                            <form>
                                <div className="form-floating m-2 text-center">
                                    <h1 className="h3 mb-3 fs-3 text-white">Password Reset Successfull</h1>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="text-center">
                            <i className="bi bi-braces-asterisk text-beige fs-1"></i>
                        </div>
                        <div className='w-350'>
                            <form>
                                <div className="form-floating m-2 text-center">
                                    <h1 className="h3 mb-3 fs-3 text-white">Enter new password</h1>
                                </div>
                                <div className="form-floating m-2 w-100">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="floatingPassword"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => handlePasswordChange(e)}
                                        onBlur={() => setTimeout(() => matchPassword(), 0)}
                                        required
                                    />
                                    <label htmlFor="floatingPassword">New Password</label>
                                </div>
                                <div className="form-floating m-2 w-100">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="floatingRePassword"
                                        placeholder="Confirm Password"
                                        value={rePassword}
                                        onChange={(e) => handleRePasswordChange(e)}
                                        onBlur={() => setTimeout(() => matchPassword(), 0)}
                                        required
                                    />
                                    <label htmlFor="floatingRePassword">Confirm Password</label>
                                </div>

                                {!passwordMatch && (
                                    <div className="text-danger alert alert-warning m-2 w-100 fw-bold">Passwords do not match!</div>
                                )}

                                <div className="alert text-info alert-dismissible fade show" role="alert">
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
                                    <button type="button" className="btn-close bg-secondary ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>

                                <div className="mt-1 text-center my-3">
                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-primary pt-1 profile-button w-100"
                                            type="button"
                                            onClick={handleResetPassword}
                                            disabled={isButtonDisabled()}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}


const ConfirmPin = ({ pinCode, resetEmailMessage2, setActiveComponet }) => {
    const [inputCode, setInputCode] = useState('');
    const [pinConfirmMessage, setPinConfirmMessage] = useState(resetEmailMessage2);

    const handleConfirmPin = async () => {
        if (pinCode !== inputCode) {
            setPinConfirmMessage('Code Not Matched.');
        } else if (pinCode === inputCode) {
            setActiveComponet('SetNewPassword');
        } else {
            setPinConfirmMessage('Threr is a error!');
        }
    }

    const isButtonDisabled = () => {
        return (
            inputCode.length !== 6
        );
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="card bg-transparent">
                <div className="text-center">
                    <i className="bi bi-envelope-paper text-beige fs-1"></i>
                </div>
                <form>
                    <div className="form-floating m-2 text-center mb-4">
                        <h1 className="h3 mb-3 fs-3 text-white">Input Verification Code</h1>
                    </div>
                    <div className="form-floating m-2">
                        <input
                            type="text"
                            className="form-control bg-warning-subtle fs-2 fw-bold text-center p-2"
                            id="floatingCodeInput"
                            style={{letterSpacing: '5px'}}
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="text-center my-4">
                        <p className="text-center text-info">{pinConfirmMessage}</p>
                    </div>
                    <div className="text-center my-4">
                        <button className="btn btn-primary w-75 py-2" type="button" onClick={handleConfirmPin} disabled={isButtonDisabled()}>
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


const ResetEmail = ({ username, setUsername, setPinCode, setResetEmailMessage2, setActiveComponet }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [resetEmailMessage, setResetEmailMessage] = useState('');

    const handleResetEmail = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/email/reset-password/`, {
                username: username,
            });

            if (response.data.message && response.data.code) {
                setResetEmailMessage(response.data.message);
                setResetEmailMessage2(response.data.message);
                setPinCode(response.data.code);
                setUsername(username);
                setIsLoading(false);
                setActiveComponet('ConfirmPin');
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                setResetEmailMessage(error.response.data.message);
            } else if (error.code === "ERR_NETWORK") {
                setResetEmailMessage("Network Error. It's our fault!");
            } else {
                setResetEmailMessage("An error occurred. Please try again/later.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center">
            <div className="card bg-transparent">
                <div className="text-center">
                    <i className="bi bi-envelope text-beige fs-1"></i>
                </div>
                <form>
                    <div className="form-floating m-2 text-center mb-4">
                        <h1 className="h3 mb-3 fs-3 text-white">Send Verification Code</h1>
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
                        <p className="text-center text-info">{resetEmailMessage}</p>
                    </div>
                    <div className="text-center my-4">
                        <button className="btn btn-primary w-75 py-2" type="button" onClick={handleResetEmail} disabled={username.length < 1}>
                            {isLoading ? (
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>) : (<div> Send </div>)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default ResetPassword;
