/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import { getOrdinal } from '../../utils/utils.js';
import Select from 'react-select'
import { AddSection, SectionDetail } from './ManageSections.jsx';

const ManageBatches = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('BatchList');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageBatches')}>
            <i className="bi-layers"></i> Manage Batches
        </button>
    );

    // fetch programs for select 
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

                const response = await axios.get(`${API_BASE_URL}/academy/programs/`, config);
                setPrograms(response.data);
            } catch (error) {
                setError(' Failed to fetch programs/batchs list.');
                console.error(error);
            }
        };

        if (programs.length === 0) {
            fetchDepartments();
        }

    }, []);

    const batchDetail = (batch) => {
        setSelectedBatch(batch);
        setShowComponent('BatchDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'BatchList':
                return <BatchList batchDetail={batchDetail} />;
            case 'AddBatch':
                return <AddBatch programs={programs} />;
            case 'BatchDetails':
                return <BatchDetail viewBatch={selectedBatch} programs={programs} />;
            default:
                return <BatchList batchDetail={batchDetail} />;
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

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Batches</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'BatchList'}
                    onClick={() => setShowComponent('BatchList')}>
                    List All Batches
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddBatch'}
                    onClick={() => setShowComponent('AddBatch')}>
                    Add New Batch
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


const AddBatch = ({ programs }) => {
    const accessToken = getAccessToken();
    const form = {
        number: '',
        session: '',
        program: '',
        status: true,
    }
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(form);
    const [selectedProgram, setSelectedProgram] = useState('');


    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.name}`
    }));


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleProgramChange = (selectedOption) => {
        setSelectedProgram(selectedOption);
        setFormData({ ...formData, program: selectedOption.value });
    };

    const handleSwitch = (e) => {
        setFormData({ ...formData, [e.target.name]: !formData[e.target.name] });
    };

    const resetForm = () => {
        setFormData(form);
        setSelectedProgram([]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // return;
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/batches/`, formData, config);
            // clear form
            resetForm();
            setMessage('Batch added successfully.');
            setError('');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            if (errorArray == 'The fields number, program must make a unique set.') {
                                return "Probably this batch already exists"
                            }
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
                    setError(`Error creating Batch. \n${errorMessages}`);
                } else {
                    setError('Error creating Batch. Please try again.');
                }
            } else {
                setError('Error creating Batch. Please try again.');
            }
            setMessage('');
            console.error('Error creating Batch:', error);
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

            <div className="">
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Program: </label>
                            <Select
                                options={programOptions}
                                isMulti={false}
                                value={selectedProgram}
                                onChange={handleProgramChange}
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Batch number:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="number"
                                value={formData.number}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Session:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="session"
                                value={formData.session}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <div className="my-4 input-group form-check-reverse form-switch text-start">
                                <label className="form-check-label form-label text-secondary me-4" htmlFor="flexStaffSwitchCheckChecked">
                                    Status(open/closed):
                                </label>
                                <input
                                    className="form-check-input border p-2 rounded-3 border border-secondary"
                                    type="checkbox"
                                    name="status"
                                    onChange={handleSwitch}
                                    checked={formData.status}
                                    style={{ width: "6em" }}
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Batch</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const BatchList = ({ batchDetail }) => {
    const accessToken = getAccessToken();
    const [batches, setBatches] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        setFilteredData(batches);
    }, [batches]);

    const fetchBatches = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/batches/`, config);
            setBatches(response.data);
        } catch (error) {
            setError(' Failed to fetch batch list.');
            console.error('Error fetching batches:', error);
        }
    };


    const getBatch = (data) => {
        return `${data.program ? data.program.acronym : ''} ${getOrdinal(data.number)}`;
    };

    const getStatus = (data) => {
        return data.status ? <i className="bi bi-toggle-on fs-6 fw-light"> Active </i> : <i className="bi bi-toggle-off fs-6 fw-light"> Inactive </i>;
    };

    const getSections = (sections) => {
        const totalSections = sections.length;
        const sectionNames = sections.map(obj => obj.name).join(", ");
        return <div>
            <span className='bedge bg-beige text-darkblue rounded px-2 mx-2'>{totalSections}</span>
            <span>{sectionNames}</span>
        </div>;
    };

    const getSeats = (sections) => {
        const totalMaxSeats = sections.reduce((accumulator, obj) => accumulator + obj.max_seats, 0);
        const totalAvailableSeats = sections.reduce((accumulator, obj) => accumulator + obj.available_seats, 0);

        return <div>{totalAvailableSeats}/{totalMaxSeats}</div>;
    };


    const handleBatchClick = (batch) => {
        batchDetail(batch);
    };


    const columns = [
        {
            name: 'Status',
            selector: (row) => getStatus(row),
        },
        {
            name: 'Batch',
            selector: (row) => getBatch(row),
            sortable: true,
        },
        {
            name: 'Session',
            selector: (row) => row.session,
            sortable: true,
        },
        {
            name: 'Sections',
            selector: (row) => row.sections.length,
            sortable: true,
            cell: (row) => getSections(row.sections),
        },
        {
            name: 'Seats',
            selector: (row) => row.sections.reduce((accumulator, obj) => accumulator + obj.max_seats, 0),
            sortable: true,
            cell: (row) => getSeats(row.sections),
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleBatchClick(row)}
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
        const filteredResults = batches.filter(
            (batch) =>
                getBatch(batch).toLowerCase().includes(keyword) ||
                batch.program.acronym.toLowerCase().includes(keyword) ||
                batch.session.toLowerCase().includes(keyword) ||
                batch.status.toString().toLowerCase().includes(keyword) ||
                batch.number.toString().toLowerCase().includes(keyword)
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

            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search..."
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


const BatchDetail = ({ viewBatch, programs }) => {
    const accessToken = getAccessToken();
    const [batch, setBatch] = useState(viewBatch);
    const [formData, setFormData] = useState(batch);
    const [isEditing, setIsEditing] = useState(false);
    const [deactive, setDeactive] = useState(false);
    const [reload, setReload] = useState(1);
    const [isDelete, setIsDelete] = useState(false);
    const [isAddSection, setIsAddSection] = useState(false);
    const [isEditSection, setIsEditSection] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedProgram, setSelectedProgram] = useState([]);
    const sections = batch.sections;


    const fetchBatch = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/batches/${viewBatch.id}`, config);
            setBatch(response.data);
            setFormData(response.data);
        } catch (error) {
            setError(' Failed to fetch batch.');
            console.error('Error fetching batch:', error);
        }
    };

    useEffect(() => {
        fetchBatch();
        console.log('reload')
    }, [reload])

    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.name}`
    }));


    const setDetails = () => {
        // Set batch details from id of viewBatch.program. 
        const filteredProgram = programOptions.find(programOption => batch.program.id === programOption.value);
        setSelectedProgram(filteredProgram);
    }

    const resetForm = () => {
        setFormData(batch);
        setDetails();
    }

    useEffect(() => {
        setDetails();
    }, [])

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSwitch = (e) => {
        setFormData({ ...formData, [e.target.name]: !formData[e.target.name] });
    };

    const handleProgramChange = (selectedOption) => {
        setSelectedProgram(selectedOption);
        setFormData({ ...formData, program: selectedOption.value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSuccessMessage('');
        setFailedMessage('');
    };

    const handleSectionDetails = (section) => {
        setSelectedSection(section);
        setIsAddSection(false);
        setIsEditSection(true);
    }

    const handleSectionAdd = () => {
        setIsEditSection(false);
        setIsAddSection(!isAddSection)
    }

    const handleUpdate = async () => {
        setSuccessMessage('');
        setFailedMessage('');
        const updateForm = { ...formData, program: selectedProgram.value };
        if (JSON.stringify(batch) === JSON.stringify(formData)) {
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
            await axios.patch(`${API_BASE_URL}/academy/batches/${batch.id}/`, updateForm, config);
            setIsEditing(false);
            setDeactive(true);
            setSuccessMessage('Batch updated successfully.');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            if (errorArray == 'The fields number, program must make a unique set.') {
                                return "Probably a similar batch already exists"
                            }
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
                    setFailedMessage(`Error updating Batch. \n${errorMessages}`);
                } else {
                    setFailedMessage('Error updating Batch. Please try again.');
                }
            } else {
                setFailedMessage('Error updating Batch. Please try again.');
            }
            console.error('Error updating Batch:', error);
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
            await axios.delete(`${API_BASE_URL}/academy/batches/${batch.id}/`, config);
            setSuccessMessage('Batch deleted successfully.');
            setDeactive(true);
            setIsDelete(false);
            setIsEditing(false);
        } catch (error) {
            setFailedMessage('Batch deletion failed. Please try again later.');
            console.error('Error deleting batch:', error);
        }
    };


    return (
        <div className='mb-5 pb-5'>
            <h2 className='text-center font-merriweather'>
                <span className="badge bg-white p-2 fw-normal text-secondary fs-6 border border-beige">Batch Detail</span>
            </h2>
            <div className='d-flex'>
                <button type="button" disabled={deactive} className="btn btn-darkblue2 ms-auto rounded-circle p-3 mx-1 lh-1" onClick={handleEditToggle}><i className='bi bi-pen'></i></button>
                <button type="button" disabled={deactive} className="btn btn-danger me-auto rounded-circle p-3 mx-1 lh-1" onClick={() => setIsDelete(!isDelete)}><i className='bi bi-trash'></i></button>
            </div>

            <button className='btn btn-sm btn-light p-0 px-2 my-3 d-flex mx-auto' onClick={() => { setReload(reload + 1) }}>
                <small><i className="bi bi-arrow-clockwise"></i> Reload </small>
            </button>

            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this data?</h6>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                            <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(!isDelete)}> No </button>
                        </div>
                    </div>
                </div>}
            {successMessage && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {successMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}
            {failedMessage && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {failedMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setFailedMessage('')}></button>
                </div>
            )}

            <form>
                <div className='row'>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Program: </label>
                        <Select
                            options={programOptions}
                            isMulti={false}
                            value={selectedProgram}
                            onChange={handleProgramChange}
                            isDisabled={!isEditing}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Batch number:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Session:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="session"
                            value={formData.session}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <div className="my-4 input-group form-check-reverse form-switch text-start">
                            <label className="form-check-label form-label text-secondary me-4" htmlFor="flexStaffSwitchCheckChecked">
                                Status(open/closed):
                            </label>
                            <input
                                className="form-check-input border p-2 rounded-3 border border-secondary"
                                type="checkbox"
                                name="status"
                                onChange={handleSwitch}
                                checked={formData.status}
                                style={{ width: "6em" }}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>
                {isEditing && <div className='d-flex'>
                    <div className="btn-group gap-1 m-4 mx-auto">
                        <button type="button" className="btn btn-darkblue2" onClick={handleUpdate}>Update Batch</button>
                        <button type="button" className="btn btn-dark btn-sm" onClick={resetForm}>Reset</button>
                    </div>
                </div>}
            </form>

            <hr className='border border-beige border-3 opacity-75 rounded-3' />

            {sections && <div className='col-sm-12 col-md-8 my-2  mx-auto'>
                <h3 className="mt-5 text-center fs-6 font-merriweather fw-bold text-secondary">Sections</h3>

                <button className='btn btn-sm btn-beige m-2 d-flex mx-auto p-1 px-3 border' onClick={handleSectionAdd}>Add Section</button>

                <button className='btn btn-sm btn-light p-0 px-2 my-1 d-flex mx-auto' onClick={() => { setReload(reload + 1) }}>
                    <small><i className="bi bi-arrow-clockwise"></i> Reload </small>
                </button>

                {(sections.length > 0) && <div className='m-1 my-3'>
                    <div className="d-flex justify-content-center">
                        <div className="btn-group gap-1">
                            <button className='btn btn-light border mb-2 disabled'>Available Sections : </button>
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    className="btn btn-light border mb-2"
                                    onClick={() => { handleSectionDetails(section) }}
                                    disabled={isEditSection}
                                >
                                    <strong> {section.name} </strong>
                                    <span className='badge bg-secondary text-wrap'> {`${section.available_seats}/${section.max_seats}`} </span>
                                </button>
                            ))}
                        </div>
                    </div></div>}

                {isAddSection && <div className='border rounded'>
                    <button className='m-1 badge border-0 bg-danger d-flex ms-auto' onClick={handleSectionAdd}>Close</button>
                    <AddSection accessToken={accessToken} batch={batch.id} />
                </div>}

                {isEditSection && <div className='border rounded'>
                    <button className='m-1 badge border-0 bg-danger d-flex ms-auto' onClick={() => setIsEditSection(!isEditSection)}>Close</button>
                    <SectionDetail accessToken={accessToken} viewSection={selectedSection} />
                </div>}
            </div>}

        </div>
    );
};


export default ManageBatches;
