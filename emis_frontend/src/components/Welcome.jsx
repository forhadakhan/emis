/**
 * Calling from: 
 *              App.jsx 
 * Calling to: 
 *              CoverPage.jsx 
 *              Auth.jsx 
 */

import React, { useState } from 'react';
import AuthHandler from './auth';
import '../styles/cover.css';
import Logo64 from '../assets/logos/emis-64x64.png';
import axios from 'axios';
import API_BASE_URL from '../utils/config';


const WelcomePage = ({ onLoginSuccess }) => {
    const [activeCoverComponent, setActiveComponent] = useState('home');

    const componentController = (id) => {
        setActiveComponent(id);
    };

    const renderComponent = () => {
        switch (activeCoverComponent) {
            case 'home':
                return <CoverParagraph />;
            case 'contact':
                return <Contact />;
            case 'apply':
                return <Apply />;
            case 'auth':
                return <AuthHandler onLoginSuccess={onLoginSuccess} />;
            default:
                return <CoverParagraph />;
        }
    };

    return (
        <>
            <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">

                <header className='mb-auto'>
                    <div className="px-3 py-2">
                        <div className="container">
                            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                                <a href="/" className="d-flex align-items-center my-4 my-lg-0 me-lg-auto text-beige text-decoration-none">
                                    <img className="ms-2 img-fluid" src={Logo64} alt="EMIS Logo" style={{ maxHeight: '64px' }} />
                                    <h1 className='display-4 px-2 header-beige'>EMIS</h1>
                                </a>

                                <ul className="nav col-12 col-lg-auto my-4 justify-content-center my-md-0 text-small">
                                    <li>
                                        <a id="home" className={`btn nav-link text-beige ${activeCoverComponent === 'home' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('home')}>
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a id="actions" className={`btn nav-link text-beige ${activeCoverComponent === 'contact' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('contact')}>
                                            Contact
                                        </a>
                                    </li>
                                    <li>
                                        <a id="settings" className={`btn nav-link text-beige ${activeCoverComponent === 'apply' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('apply')}>
                                            Apply
                                        </a>
                                    </li>
                                    <li>
                                        <a id="profile" className={`btn nav-link text-beige ${activeCoverComponent === 'auth' ? 'active-beige' : 'active-beige-hidden'}`} onClick={() => componentController('auth')}>
                                            Sign in
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="px-3">
                    {renderComponent()}
                </main>

                <footer className="mt-auto text-white-50">
                    <p className="mt-5 text-white-50 text-center">Education Management Information System (EMIS)</p>
                    <p className="mb-3 text-white-50 text-center">&copy; 2023</p>
                </footer>
            </div>
        </>
    );
}


const CoverParagraph = () => {
    return (
        <div className="text-beige m-4">
            <h1>Education Management Information System</h1>
            <p className="lead">
                Welcome to the Education Management Information System (EMIS) -
                Your ultimate educational institution management solution.
                With advanced web technologies including Django, React.js, PostgreSQL, and
                Gmail SMTP, our system revolutionizes operations.
                From user authentication to student management, grading, document delivery,
                collaboration tools, and powerful analytics,
                EMIS enhances educational excellence.
                Join us on this transformative journey towards a more efficient ecosystem.
            </p>
        </div>
    );
}


const Contact = () => {
    const getInitialFormData = () => ({
        name: '',
        email: '',
        message: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/contact/`, formData);

            if (response.status === 201) {
                // Success message
                setSuccessMessage(response.data.message);
                handleClear();
            } else {
                // Handle error response
                setSuccessMessage(null);
                setErrorMessage('An error occurred.');
            }
        } catch (error) {
            setSuccessMessage(null);
            setErrorMessage('An error occurred.');
        }
    };

    const handleClearStatus = () => {
        return  (formData.name === ''  && formData.email === '' && formData.message === '');
      };
      
    const handleClear = () => {
        setFormData(getInitialFormData());
    };

    return (
        <div className="p-5 my-5 text-beige">
            <div className="">
                <div className="row">
                    <div className="col-md-5 mr-auto">
                        <h2 className="mb-5">Contact Us</h2>
                        <ul className="list-unstyled pl-md-5 my-5">
                            <li className="d-flex mb-2">
                                <span className="me-3"><i className="bi bi-pin-map-fill"></i></span> 42 Street Name, City Name Here, <br /> Union Countries
                            </li>
                            <li className="d-flex mb-2">
                                <span className="me-3"><i className="bi bi-telephone-fill"></i></span> +8 (222) 345 6789
                            </li>
                            <li className="d-flex">
                                <span className="me-3"><i className="bi bi-envelope-fill"></i></span>
                                <a className="text-decoration-none text-beige" href="mailto:contact@emis.test">contact@emis.test</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <form className="mb-5" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label htmlFor="name" className="col-form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label htmlFor="email" className="col-form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 form-group">
                                    <label htmlFor="message" className="col-form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        id="message"
                                        cols="30"
                                        rows="7"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 my-3">
                                    {successMessage && (
                                        <div className="alert alert-success alert-dismissible fade show fw-bold" role="alert">
                                            <strong><i className="bi bi-check-circle-fill"></i></strong> {successMessage}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    )}
                                    {errorMessage && (
                                        <div className="alert alert-warning alert-dismissible fade show fw-bold" role="alert">
                                            <strong><i className="bi bi-exclamation-triangle-fill"></i></strong> {errorMessage}
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12 d-flex">
                                    <div className='mx-auto'>
                                        <button className="btn btn-beige fw-bold m-3" type="submit">
                                            Send Message
                                        </button>
                                        <button className="btn btn-darkblue border boder-beige fw-bold m-3 pt-1" disabled={handleClearStatus()} type="button" onClick={handleClear}>
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div id="form-message-warning mt-4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};





const Apply = () => {

}

export default WelcomePage;
