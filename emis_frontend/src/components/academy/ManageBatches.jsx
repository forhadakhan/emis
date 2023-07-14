/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import Select from 'react-select'

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
                return <BatchList batchDetail={batchDetail} programs={programs} />;
            case 'AddBatch':
                return <AddBatch programs={programs} />;
            case 'BatchDetails':
                return <BatchDetail viewBatch={selectedBatch} programs={programs} />;
            default:
                return <BatchList batchDetail={batchDetail} programs={programs} />;
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
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Program: </label>
                            <Select
                                options={programOptions}
                                isMulti={false}
                                value={selectedProgram}
                                onChange={handleProgramChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Batch</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const BatchList = ({ batchDetail, programs }) => {
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

    const getProgram = (id) => {
        const program = programs.find((program) => program.id === id);
        return program ? program.name : null;
    };


    const handleBatchClick = (batch) => {
        batchDetail(batch);
    };


    const columns = [
        {
            name: 'Number',
            selector: (row) => row.number,
            sortable: true,
        },
        {
            name: 'Session',
            selector: (row) => row.session,
            sortable: true,
        },
        {
            name: 'Program',
            selector: (row) => getProgram(row.program),
            sortable: true,
            width: '50%',
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
                getProgram(batch.program).toLowerCase().includes(keyword) ||
                batch.session.toLowerCase().includes(keyword) ||
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

const BatchDetail = () => {

}




export default ManageBatches;
