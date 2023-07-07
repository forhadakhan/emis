/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageInstitutes = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('InstituteList');
    const [selectedInstitute, setSelectedInstitute] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageInstitutes')}>
            <i className="bi bi-house-gear-fill"></i> Manage Institutes
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'InstituteList':
                return <InstituteList setSelectedInstitute={setSelectedInstitute} setShowComponent={setShowComponent} />;
            case 'AddInstitute':
                return <AddInstitute />;
            case 'InstituteDetails':
                return <InstituteDetails institute={selectedInstitute} />;
            default:
                return <InstituteList />;
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

            <h2 className="text-center m-5 px-2">Manage Institutes</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'InstituteList'}
                    onClick={() => setShowComponent('InstituteList')}>
                    List All Institutes
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddInstitute'}
                    onClick={() => setShowComponent('AddInstitute')}>
                    Add New Institute
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



const InstituteList = ({ setSelectedInstitute, setShowComponent }) => {
    const [institutes, setInstitutes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const accessToken = getAccessToken();

    useEffect(() => {
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
                // console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchInstitutes();
    }, [accessToken, refresh]);

    useEffect(() => {
        setFilteredData(institutes.filter(institute =>
            institute.name.toLowerCase().includes(searchKeyword.toLowerCase())
        ));
    }, [institutes, searchKeyword]);

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleEditModal = (institute) => {
        setSelectedInstitute(institute);
        setShowComponent('InstituteDetails');
    };

    const handleDeleteModal = (institute) => {
        setSelectedInstitute(institute);
        setShowDeleteModal(true);
    };

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Acronym',
            selector: 'acronym',
            sortable: true,
        },
        {
            name: 'Code',
            selector: 'code',
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="mx-auto">
                    <button
                        type="button"
                        className="btn border-0 btn-outline-primary p-1 mx-1"
                        onClick={() => handleEditModal(row)}
                    >
                        <i className="bi bi-eye"> | </i>   
                        <i className="bi bi-vector-pen"> </i> 
                    </button>
                    <button
                        type="button"
                        className="btn border-0 btn-outline-danger p-1 mx-1"
                        onClick={() => handleDeleteModal(row)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            button: true,
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '8px',
                fontWeight: 'bold',
            },
        },
    };

    return (
        <div>
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <div className="rounded-top-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};


const InstituteDetails = ({ institute }) => {
    const [baseInstitute, setBaseInstitute] = useState(institute);
    const [updatedInstitute, setUpdatedInstitute] = useState(baseInstitute);
    const [updateMessage, setUpdateMessage] = useState('');
    const [isModify, setIsModify] = useState(true);
    const accessToken = getAccessToken();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedInstitute((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleModify = () => {
        setIsModify(!isModify);
        setUpdatedInstitute(baseInstitute);
        setUpdateMessage('');
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.patch(
                `${API_BASE_URL}/academy/institutes/${updatedInstitute.id}/`,
                updatedInstitute,
                config
            );
            setUpdateMessage('Updated Successfully');
            setBaseInstitute(updatedInstitute);
            setIsModify(!isModify);
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
                    setUpdateMessage(`Update failed,\n${errorMessages}`);
                } else {
                    setUpdateMessage('Update failed, an error occurred.');
                }
            } else {
                setUpdateMessage('Update failed, an error occurred.');
            }
            // console.error(error);
        }
    };

    return (
        <div className="m-2 m-md-5">

            <button className="btn btn-darkblue rounded-circle p-3 mb-3 d-flex mx-auto lh-1" onClick={handleModify}>
                <i className='bi bi-pen'></i>
            </button>

            <form onSubmit={handleUpdate} className=''>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Institute Name
                    </label>
                    <input
                        type="text"
                        className="form-control border border-darkblue"
                        id="name"
                        name="name"
                        value={updatedInstitute.name}
                        onChange={handleInputChange}
                        disabled={isModify}
                    />
                </div>
                <div className='row mb-3'>
                    <div className="col-6">
                        <label htmlFor="acronym" className="form-label">
                            Acronym
                        </label>
                        <input
                            type="text"
                            className="form-control border border-darkblue"
                            id="acronym"
                            name="acronym"
                            value={updatedInstitute.acronym}
                            onChange={handleInputChange}
                            disabled={isModify}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor="code" className="form-label">
                            Code
                        </label>
                        <input
                            type="number"
                            className="form-control border border-darkblue"
                            id="code"
                            name="code"
                            value={updatedInstitute.code}
                            onChange={handleInputChange}
                            disabled={isModify}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="about" className="form-label">
                        About
                    </label>
                    <textarea
                        className="form-control border border-darkblue"
                        id="about"
                        name="about"
                        value={updatedInstitute.about}
                        onChange={handleInputChange}
                        disabled={isModify}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="history" className="form-label">
                        History
                    </label>
                    <textarea
                        className="form-control border border-darkblue"
                        id="history"
                        name="history"
                        value={updatedInstitute.history}
                        onChange={handleInputChange}
                        disabled={isModify}
                    />
                </div>
                {updateMessage && 
                <div className="alert alert-info text-center fw-bold">
                    {updateMessage} 
                </div>}

                {!isModify &&
                    <button type="submit" className="btn btn-primary d-flex mx-auto fw-medium">
                        Update
                    </button>}
            </form>
        </div>
    );
};



const AddInstitute = () => {
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');
    const [code, setCode] = useState(null);
    const [about, setAbout] = useState(null);
    const [history, setHistory] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const accessToken = getAccessToken();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const newInstitute = {
                name,
                acronym,
                code,
                about,
                history,
            };

            const response = await axios.post(`${API_BASE_URL}/academy/institutes/`, newInstitute, config);
            setAlertMessage('Institute added successfully');
            setAlertType('success');

            // Clear the form
            setName('');
            setAcronym('');
            setCode('');
            setAbout('');
            setHistory('');

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

            <form onSubmit={handleSubmit}>
                <div className="mb-3 col-sm-12 col-md-6 mx-auto">
                    <label htmlFor="name" className="form-label">Institute Name</label>
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
                    <label htmlFor="about" className="form-label">About</label>
                    <textarea
                        type="textarea"
                        className="form-control"
                        id="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
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
                        required
                    />
                </div>
                <button type="submit" className="btn btn-darkblue p-1 px-2 d-flex mx-auto">Add Institute</button>
            </form>

        </div>
    );
};



export default ManageInstitutes;