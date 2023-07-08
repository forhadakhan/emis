/**
* Calling from: Activity.jsx
* Calling to: 
*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageDepartments = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('DepartmentList');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageDepartments')}>
            <i className="bi bi-house-gear-fill"></i> Manage Departments
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'DepartmentList':
                return <DepartmentList setSelectedDepartment={setSelectedDepartment} setShowComponent={setShowComponent} />;
            case 'AddDepartment':
                return <AddDepartment />;
            case 'DepartmentDetails':
                return <DepartmentDetails department={selectedDepartment} setShowComponent={setShowComponent} />;
            default:
                return <DepartmentList />;
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

            <h2 className="text-center m-5 px-2">Manage Departments</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'DepartmentList'}
                    onClick={() => setShowComponent('DepartmentList')}>
                    List All Departments
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddDepartment'}
                    onClick={() => setShowComponent('AddDepartment')}>
                    Add New Department
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



const AddDepartment = () => {
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');
    const [code, setCode] = useState(null);
    const [about, setAbout] = useState('');
    const [history, setHistory] = useState('');
    const [institute, setInstitute] = useState('');
    const [institutes, setInstitutes] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('info');
    const accessToken = getAccessToken();

    useEffect(() => {
        setAlertMessage('');
        const fetchInstitutes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/institutes/`, config);
                setInstitutes(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching available institutes list.');
                console.error(error);
            }
        };

        fetchInstitutes();
    }, [accessToken]);

    const clearForm = () => {
        setName('');
        setAcronym('');
        setCode('');
        setAbout('');
        setHistory('');
        setInstitute('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage('');

        if (!parseInt(institute)) {
            setAlertType('danger')
            setAlertMessage('A valid institute must be selected.');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const newDepartment = {
                name,
                acronym,
                code,
                about,
                history,
                institute,
            };

            const response = await axios.post(`${API_BASE_URL}/academy/departments/`, newDepartment, config);
            setAlertMessage('Department added successfully');
            setAlertType('success');

            // Clear the form
            clearForm();
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
                    setAlertMessage(`Failed to submit data,\n${errorMessages}`);
                } else {
                    setAlertMessage('Failed to submit data. Please try again.');
                }
            } else {
                setAlertMessage('Failed to submit data. Please try again.');
            }
            setAlertType('danger');
            console.error(error);
        }
    };

    return (
        <div className="container">

            {alertMessage && (
                <div className={`alert alert-${alertType} alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className={`bi ${alertType === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle'} mx-2`}></i>
                    <strong>{alertMessage}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} id='addform'>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="name" className="form-label">Department Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="acronym" className="form-label">Acronym</label>
                    <input
                        type="text"
                        className="form-control"
                        id="acronym"
                        value={acronym}
                        onChange={(e) => setAcronym(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="code" className="form-label">Code</label>
                    <input
                        type="number"
                        className="form-control"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="institutes" className="form-label">Select Institute:</label>
                    {institutes.length > 0 ? (
                        <select value={institute} onChange={(e) => setInstitute(e.target.value)} id="institutes" className="form-select" aria-label="Institute List">
                            <option value="">-- Institute List --</option>
                            {institutes.map(i => (
                                <option key={i.id} value={i.id} className=' bg-darkblue text-beige'>
                                    {i.acronym} {i.code} - {i.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            value={'-- Failed fetching institutes --'}
                            readOnly
                            disabled
                            className='text-danger fw-bold form-control'
                        />

                    )}
                </div>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="about" className="form-label">About</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                </div>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="history" className="form-label">History</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        id="history"
                        value={history}
                        onChange={(e) => setHistory(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-darkblue p-1 px-2 d-flex mx-auto">Add Department</button>
            </form>

        </div>
    );
};



const DepartmentList = () => {

}



const DepartmentDetails = () => {

}






export default ManageDepartments;

