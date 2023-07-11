/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';

const ManagePrograms = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('ProgramList');
    const [selectedProgram, setSelectedProgram] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManagePrograms')}>
            <i className="bi bi-mortarboard"></i> Manage Programs
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'ProgramList':
                return <ProgramList setSelectedProgram={setSelectedProgram} setShowComponent={setShowComponent} />;
            case 'AddProgram':
                return <AddProgram />;
            case 'ProgramDetails':
                return <ProgramDetail program={selectedProgram} setShowComponent={setShowComponent} />;
            default:
                return <ProgramList />;
        }
    }


    return (
        <>
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>

            </div>

            <h2 className="text-center m-5 px-2">Manage Programs</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'ProgramList'}
                    onClick={() => setShowComponent('ProgramList')}>
                    List All Programs
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddProgram'}
                    onClick={() => setShowComponent('AddProgram')}>
                    Add New Program
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


const AddProgram = () => {
    const accessToken = getAccessToken();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [degreeTypes, setDegreeTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        acronym: '',
        code: '',
        degree_type: '',
        department: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // fetch degree types for select 
    useEffect(() => {
        setError('');
        const fetchDepartments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/degree-types/`, config);
                setDegreeTypes(response.data);
            } catch (error) {
                setError(' Failed to fetch departments/degree-types list.');
                console.error(error);
            }
        };

        if (degreeTypes.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch departments for select 
    useEffect(() => {
        setError('');
        const fetchDepartments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/departments/`, config);
                setDepartments(response.data);
            } catch (error) {
                setError(' Failed to fetch departments/degree-types list.');
                console.error(error);
            }
        };

        if (departments.length === 0) {
            fetchDepartments();
        }

    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            acronym: '',
            code: '',
            degree_type: '',
            department: '',
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/programs/`, formData);
            // clear form
            resetForm();
            setMessage('Program added successfully.');
            setError('');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            return errorArray.map(error => `[${key}] ${error}`);
                        } else if (typeof errorArray === 'object') {
                            const errorMessage = Object.values(errorArray).join(' ');
                            return [`[${key}] ${errorMessage}`];
                        } else {
                            return [`[${key}] ${errorArray}`];
                        }
                    })
                    .join('\n');

                if (errorMessages) {
                    setError(`Error creating program. \n${errorMessages}`);
                } else {
                    setError('Error creating program. Please try again.');
                }
            } else {
                setError('Error creating program. Please try again.');
            }
            setMessage('');
            console.error('Error creating program:', error);
        }
    };

    return (
        <div>

            {message && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {message} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMessage('')}></button>
                </div>
            )}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="d-flex">
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Program name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Acronym:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="acronym"
                                value={formData.acronym}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Code:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Degree Type:</label>
                            <div className="">
                                <select value={formData.degree_type} name="degree_type" onChange={handleInputChange} id="dept" className="form-select" aria-label="Departments" required>
                                    <option value="">Select a degree type:(s)</option>
                                    {degreeTypes && degreeTypes.map(degreeType => (
                                        <option key={degreeType.id} value={degreeType.id} className='bg-darkblue text-beige'>
                                            {degreeType.acronym} {degreeType.code} - {degreeType.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Department:</label>
                            <div className="">
                                <select value={formData.department} name="department" onChange={handleInputChange} id="dept" className="form-select" aria-label="Departments" required>
                                    <option value="">Select a department</option>
                                    {departments && departments.map(department => (
                                        <option key={department.id} value={department.id} className='bg-darkblue text-beige'>
                                            {department.acronym} {department.code} - {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Program</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const ProgramList = () => {

};


const ProgramDetail = ({ program }) => {
    
};


export default ManagePrograms;
