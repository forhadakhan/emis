import React, { useState } from 'react';
import axios from 'axios';
import Logo256 from '../assets/logos/emis-256x256.png';
import API_BASE_URL from '../config';
import { saveLoginResponse } from '../auth';


const LoginComponent = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/login/`, {
                username: username,
                password: password,
            });

            // console.log(response.data);

            // Save the login response data in cookie 
            saveLoginResponse(response.data);

            // Call the onLoginSuccess function passed as prop from App.jsx to change log state
            onLoginSuccess();
        }
        catch (error) {
            // Handle login error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else if (error.code === "ERR_NETWORK") {
                setError("Network Error. It's our fault!");
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card bg-transparent">
                <form onSubmit={handleLogin}>
                    <div className="text-center">
                        <img className="mb-4" src={Logo256} alt="EMIS Logo" height="85" />
                    </div>

                    <div className="form-floating m-2 text-center">
                        <h1 className="h3 mb-3 fs-3 text-white">Please sign in</h1>
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

                    <div className="form-floating m-2">
                        <input
                            type="password"
                            className="form-control bg-warning-subtle"
                            id="floatingPassword"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    {/* Error alert */}
                    {error &&
                        <div className="alert text-bg-warning alert-dismissible fade show  m-2" role="alert">
                            <i className="bi bi-exclamation-triangle-fill"></i>  &nbsp;
                            <strong>{error}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                        </div>
                    }

                    <div className="text-center my-4">
                        <button className="btn btn-primary w-75 py-2" type="submit">
                            Sign in
                        </button>
                    </div>
                    <p className="mt-5 text-white-50 text-center">Education Management Information System (EMIS)</p>
                    <p className="mb-3 text-white-50 text-center">&copy; 2023</p>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
