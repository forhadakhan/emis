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
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('ProgramList');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [departments, setDepartments] = useState([]);
    const [degreeTypes, setDegreeTypes] = useState([]);
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManagePrograms')}>
            <i className="bi bi-mortarboard"></i> Manage Programs
        </button>
    );

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

    const programDetail = (program) => {
        setSelectedProgram(program);
        setShowComponent('ProgramDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'ProgramList':
                return <ProgramList programDetail={programDetail} departments={departments} degreeTypes={degreeTypes} />;
            case 'AddProgram':
                return <AddProgram departments={departments} degreeTypes={degreeTypes} />;
            case 'ProgramDetails':
                return <ProgramDetail program={selectedProgram} departments={departments} degreeTypes={degreeTypes} />;
            default:
                return <ProgramList programDetail={programDetail} departments={departments} degreeTypes={degreeTypes} />;
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

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Programs</h2>

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
                {error && (
                    <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                        <i className="bi bi-x-octagon-fill"> </i>
                        <strong> {error} </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                    </div>
                )}

                {renderComponent()}
            </div>
        </>
    );
}


const AddProgram = ({ departments, degreeTypes }) => {
    const accessToken = getAccessToken();
    const form = {
        name: '',
        acronym: '',
        code: '',
        degree_type: '',
        department: '',
        duration: '',
        required_credits: '',
        availability: '',
        entry_period: '',
        details: '',
    }
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(form);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const resetForm = () => {
        setFormData(form);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/programs/`, formData, config);
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
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Duration:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder='e.g. 4 years / 6 months'
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Credits: (min)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="required_credits"
                                value={formData.required_credits}
                                onChange={handleInputChange}
                                placeholder='e.g. 150'
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Availability:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="availability"
                                value={formData.availability}
                                onChange={handleInputChange}
                                placeholder='e.g. Day/Evening/Morning'
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Entry Time:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="entry_period"
                                value={formData.entry_period}
                                onChange={handleInputChange}
                                placeholder='e.g. January/July'
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Details:</label>
                            <textarea
                                type="textarea"
                                className="form-control"
                                name="details"
                                value={formData.details}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Program</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const ProgramList = ({ programDetail, departments, degreeTypes }) => {
    const [programs, setPrograms] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        setFilteredData(programs);
    }, [programs]);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/programs/`);
            setPrograms(response.data);
        } catch (error) {
            setError(' Failed to fetch programs list.');
            console.error('Error fetching programs:', error);
        }
    };

    const handleProgramClick = (program) => {
        programDetail(program);
    };

    // IN CASE WE ARE NOT RECEIVEING NESTED DATA, USE THIS 
    // const getDept = (id) => {
    //     const filteredDepartments = departments.filter(department => department.id === id);
    //     if (filteredDepartments.length > 0) {
    //         const department = filteredDepartments[0];
    //         const { acronym, code } = department;
    //         return `${acronym}`;
    //     }

    //     return ''; // Return null if no data with the given ID is found
    // }

    // IN CASE WE ARE NOT RECEIVEING NESTED DATA, USE THIS 
    // const getDegree = (id) => {
    //     const filteredDegrees = degreeTypes.filter(degreeType => degreeType.id === id);
    //     if (filteredDegrees.length > 0) {
    //         const degreeType = filteredDegrees[0];
    //         const { acronym, code } = degreeType;
    //         return `${acronym}`;
    //     }

    //     return ''; // Return empty str if no data with the given ID is found
    // }

    const columns = [
        {
            name: 'Program',
            selector: (row) => `${row.code} - ${row.degree_type.acronym} in ${row.acronym}`,
            sortable: true,
        },
        {
            name: 'Duration',
            selector: (row) => row.duration,
            sortable: true,
        },
        {
            name: 'Department',
            selector: (row) => `${row.department.acronym} - ${row.department.code}`,
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleProgramClick(row)}
                >
                    Details
                </button>
            ),
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontWeight: 'bold'
            },
        },
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = programs.filter(
            (program) =>
                program.department.acronym.toLowerCase().includes(keyword) ||
                `${program.department.acronym} - ${program.department.code}`.toLowerCase().includes(keyword) ||
                program.degree_type.acronym.toLowerCase().includes(keyword) ||
                program.name.toLowerCase().includes(keyword) ||
                program.acronym.toLowerCase().includes(keyword) ||
                program.duration.toLowerCase().includes(keyword) ||
                program.availability.toLowerCase().includes(keyword) ||
                program.entry_period.toLowerCase().includes(keyword) ||
                program.required_credits.toString().toLowerCase().includes(keyword) ||
                program.code.toString().toLowerCase().includes(keyword)
        );
        setFilteredData(filteredResults);
    };

    return (
        <div>
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search with any field e.g. availability/duration ..."
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <div className="rounded-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    highlightOnHover
                />
            </div>
        </div>
    );
};


const ProgramDetail = ({ program, departments, degreeTypes }) => {
    const accessToken = getAccessToken();
    const [formData, setFormData] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [deactive, setDeactive] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');

    // set program data when this component mounts/loads 
    useEffect(() => {
        setFormData({ 
            ...program, 
            ['degree_type']: program.degree_type.id,
            ['department']: program.department.id,
        });
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // enable or disable program form inputs 
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSuccessMessage('');
        setFailedMessage('');
    };

    const handleUpdate = async () => {
        setSuccessMessage('');
        setFailedMessage('');
        if (program === formData) {
            setFailedMessage('No changes to update.');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };
            await axios.patch(`${API_BASE_URL}/academy/programs/${program.id}/`, formData, config);
            setIsEditing(false);
            setDeactive(true);
            setSuccessMessage('Program updated successfully.');
        } catch (error) {
            setFailedMessage('Program update failed. Please try again later.');
            console.error('Error updating program:', error);
        }
    };

    const handleDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            await axios.delete(`${API_BASE_URL}/academy/programs/${program.id}/`, config);
            setSuccessMessage('Program deleted successfully.');
            setDeactive(true);
            setIsDelete(false);
        } catch (error) {
            setFailedMessage('Program deletion failed. Please try again later.');
            console.error('Error deleting program:', error);
        }
    };

    return (
        <div className='mb-5 pb-5'>

            {/* headings  */}
            <h2 className='text-center font-merriweather'>
                <span className="badge bg-white p-2 fw-normal text-secondary fs-6 border border-beige">Program Detail</span>
            </h2>

            {/* edit or delete buttons  */}
            <div className='d-flex'>
                <button type="button" disabled={deactive} className="btn btn-darkblue2 ms-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={handleEditToggle}><i className='bi bi-pen'></i></button>
                <button type="button" disabled={deactive} className="btn btn-danger me-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={() => setIsDelete(!isDelete)}><i className='bi bi-trash'></i></button>
            </div>

            {/* delete confirmation  */}
            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this program?</h6>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                            <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(!isDelete)}> No </button>
                        </div>
                    </div>
                </div>}

            {/* api request success response message  */}
            {successMessage && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {successMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}

            {/* api request fail response message  */}
            {failedMessage && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {failedMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setFailedMessage('')}></button>
                </div>
            )}

            {/* program data form  */}
            <form>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Acronym:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="acronym"
                        value={formData.acronym}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Code:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Degree Type:</label>
                    <div className="">
                        <select value={formData.degree_type} name="degree_type" disabled={!isEditing} onChange={handleInputChange} id="dept" className="form-select" aria-label="Departments" required>
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
                        <select value={formData.department} name="department" disabled={!isEditing} onChange={handleInputChange} id="dept" className="form-select" aria-label="Departments" required>
                            <option value="">Select a department</option>
                            {departments && departments.map(department => (
                                <option key={department.id} value={department.id} className='bg-darkblue text-beige'>
                                    {department.acronym} {department.code} - {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Duration:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder='e.g. 4 years / 6 months'
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Credits: (min)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="required_credits"
                        value={formData.required_credits}
                        onChange={handleInputChange}
                        placeholder='e.g. 150'
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Availability:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder='e.g. Day/Evening/Morning'
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Entry Time:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="entry_period"
                        value={formData.entry_period}
                        onChange={handleInputChange}
                        placeholder='e.g. January/July'
                        disabled={!isEditing}
                    />
                </div>
                <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Details:</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                        rows="4"
                        disabled={!isEditing}
                    />
                </div>
                {isEditing && <>
                    <button type="button" className="btn btn-darkblue2 mx-auto m-4 d-flex" onClick={handleUpdate}>Update</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={() => setFormData(program)}>Reset</button>
                </>}
            </form>
        </div>
    );
};


export default ManagePrograms;
