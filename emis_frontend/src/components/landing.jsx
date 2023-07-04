import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap'
import API_BASE_URL from '../utils/config';
import Logo64 from '../assets/logos/emis-64x64.png';
import HomeComponent from './home';
import ActivityComponent from './Activity';
import SettingsComponent from './settings';
import ProfileComponent from './Profile';
import AcademicCalendar from './FullCalendar';
import Test from '../test';
import { logout, getRefreshToken, getUserRole, getUserData } from '../utils/auth.js';


const LandingComponent = ({ onLogoutSuccess }) => {
    // console.log(response);
    // const user = getUserData();

    const handleSignOut = async (e) => {
        e.preventDefault();
        // Get the refresh token and send it to backend for blacklisting. 
        const refreshToken = getRefreshToken();
        try {
            const response = await axios.post(`${API_BASE_URL}/logout/`, {
                refresh_token: refreshToken,
            });

            // Logout from frontend by removing access_token from local storage
            logout();

            // Call the onLogoutSuccess function passed as prop from App.jsx to change log state
            onLogoutSuccess(response.data)
        }
        catch (error) {
            // Handle sign-out error
            console.error('Sign-out error', error);
        }
    };

    const userRole = getUserRole();
    const [activeComponent, setActiveComponent] = useState('home');

    const componentController = (id) => {
        setActiveComponent(id);
    };


    return (
        <div className='text-light'>

            <header className="mt-3">
                <div className="px-3 py-2">
                    <div className="container content-sm-75">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <a href="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-beige text-decoration-none">
                                <img className="ms-2" src={Logo64} alt="EMIS Logo" height="64" />
                                <h1 className='display-4 px-2 header-beige'>EMIS</h1>
                            </a>

                            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                                <li>
                                    <a id="home" className={`btn nav-link text-beige ${activeComponent === 'home' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('home')}>
                                        <i className="bi bi-house-door text-center fs-4 d-block"></i>
                                        <span className='fw-lighter'>Home</span>
                                    </a>
                                </li>
                                <li>
                                    <a id="actions" className={`btn nav-link text-beige ${activeComponent === 'actions' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('actions')}>
                                        <i className="bi bi-grid text-center fs-4 d-block"></i>
                                        <span className="fw-lighter">Activity</span>
                                    </a>
                                </li>
                                <li>
                                    <a id="settings" className={`btn nav-link text-beige ${activeComponent === 'settings' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('settings')}>
                                        <i className="bi bi-gear text-center fs-4 d-block"></i>
                                        <span className="fw-lighter">Settings</span>
                                    </a>
                                </li>
                                <li>
                                    <a id="profile" className={`btn nav-link text-beige ${activeComponent === 'profile' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('profile')}>
                                        <i className="bi bi-person-circle text-center fs-4 d-block"></i>
                                        <span className="fw-lighter">Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a id="signout" className="btn nav-link text-beige red-warning" onClick={(e) => handleSignOut(e)}>
                                        <i className="bi bi-box-arrow-right text-center fs-4 d-block"></i>
                                        <span className="fw-lighter">Signout</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container mb-3">
                    <div className="d-flex px-2 py-2 flex-wrap justify-content-center">
                        {/* <form className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search">
                            <input type="search" className="form-control border-0" placeholder="Search..." aria-label="Search" />
                        </form> */}

                        <div className="text-end">
                            {/* <a id="home" className={`btn nav-link text-beige ${activeComponent === 'test' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('test')}>
                                .
                            </a> */}
                            {/* <button type="button" className="btn btn-warning text-black text-capitalize" style={{ cursor: 'none' }}>
                                {['administrator', 'teacher', 'student', 'staff'].includes(userRole) ? userRole : 'None'}
                            </button> */}
                        </div>

                    </div>
                </div>
            </header>

            <section className="bg-light text-darkblue mt-0 py-4 rounded-top-5 min-vh-100">
                {activeComponent === 'home' && <HomeComponent componentController={componentController} />}
                {activeComponent === 'actions' && <ActivityComponent />}
                {activeComponent === 'settings' && <SettingsComponent />}
                {activeComponent === 'profile' && <ProfileComponent componentController={componentController} />}
                {activeComponent === 'academic_calendar' && <AcademicCalendar />}
                {activeComponent === 'test' && <Test />}
            </section>

        </div>

    );
}

export default LandingComponent;
