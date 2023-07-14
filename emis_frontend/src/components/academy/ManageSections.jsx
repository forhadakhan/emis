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

const ManageSections = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('SectionList');
    const [selectedSection, setSelectedSection] = useState('');
    const [batches, setBatches] = useState([]);
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageSections')}>
            <i className="bi-layers-half"></i> Manage Sections
        </button>
    );

    // fetch batches for select 
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

                const response = await axios.get(`${API_BASE_URL}/academy/batches/`, config);
                setBatches(response.data);
            } catch (error) {
                setError(' Failed to fetch batches list.');
                console.error(error);
            }
        };

        if (batches.length === 0) {
            fetchDepartments();
        }

    }, []);

    const sectionDetail = (section) => {
        setSelectedSection(section);
        setShowComponent('SectionDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'SectionList':
                return <SectionList batchDetail={sectionDetail} batches={batches} accessToken={accessToken} />;
            case 'AddSection':
                return <AddSection batches={batches} accessToken={accessToken} />;
            case 'SectionDetails':
                return <SectionDetail viewSection={selectedSection} batches={batches} />;
            default:
                return <SectionList batchDetail={sectionDetail} batches={batches} accessToken={accessToken} />;
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

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Sections</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'SectionList'}
                    onClick={() => setShowComponent('SectionList')}>
                    List All Sections
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddSection'}
                    onClick={() => setShowComponent('AddSection')}>
                    Add New Section
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



const AddSection = ({ accessToken, batches }) => {
    const form = {
        name: '',
        batch: '',
        max_seats: '',
    }
    const [formData, setFormData] = useState(form);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const batchOptions = batches.map(batch => ({
        value: batch.id,
        label: `${batch.number} [Session: ${batch.session}]`
    }));

    const handleBatchChange = (selectedOption) => {
        setSelectedBatch(selectedOption);
        setFormData({ ...formData, batch: selectedOption.value });
    };

    const resetForm = () => {
        setFormData(form);
        setSelectedBatch('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/sections/`, formData, config);
            console.log('Section added:', response.data);
            setMessage('Batch added successfully.');
            setError('');
            resetForm();
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            if (errorArray == "The fields name, batch must make a unique set.") {
                                return "Probably this section already exists"
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
                    setError(`Error creating section. \n${errorMessages}`);
                } else {
                    setError('Error creating section. Please try again.');
                }
            } else {
                setError('Error creating section. Please try again.');
            }
            setMessage('');
            console.error('Error creating section:', error);
        }
    };

    return (
        <div className="container mt-4">

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

            <form onSubmit={handleSubmit}>
                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Batch: </label>
                    <Select
                        options={batchOptions}
                        isMulti={false}
                        value={selectedBatch}
                        onChange={handleBatchChange}
                    />
                </div>
                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1" htmlFor="sectionName">Section Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="sectionName"
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1" htmlFor="maxSeats">Max Seats</label>
                    <input
                        type="number"
                        className="form-control"
                        id="maxSeats"
                        name='max_seats'
                        value={formData.max_seats}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Section</button>
                <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
            </form>
        </div>
    );
};



const SectionList = ({ sectionDetail, batches, accessToken }) => {
    const [sections, setSections] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSections();
    }, []);

    useEffect(() => {
        setFilteredData(sections);
    }, [sections]);

    const fetchSections = async () => {
        if(!accessToken) {
            setError(`Failed action. Please refresh or 'sign out' and 'sign in'.`);
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/sections/`, config);
            setSections(response.data);
        } catch (error) {
            setError(' Failed to fetch section list.');
            console.error('Error fetching sections:', error);
        }
    };

    const getBatch = (id) => {
        const batch = batches.find((batch) => batch.id === id);
        return batch ? `${batch.number} - Session: ${batch.session}` : null;
    };


    const handleSectionClick = (section) => {
        sectionDetail(section);
    };


    const columns = [
        {
            name: 'Batch',
            selector: (row) => getBatch(row.batch),
            sortable: true,
        },
        {
            name: 'Section',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Seats',
            selector: (row) => `${row.available_seats}/${row.max_seats}`,
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleSectionClick(row)}
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
        const filteredResults = sections.filter(
            (section) =>
                getBatch(section.batch).toLowerCase().includes(keyword) ||
                section.name.toLowerCase().includes(keyword) ||
                `${section.available_seats}/${section.max_seats}`.toLowerCase().includes(keyword) ||
                section.max_seats.toString().toLowerCase().includes(keyword)
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
                    placeholder="Search"
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



const SectionDetail = () => {

}





export default ManageSections;