/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageDegreeTypes = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('DegreeTypeList');
    const [selectedDegreeType, setSelectedDegreeType] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageDegreeTypes')}>
            <i className="bi-mortarboard-fill"></i> Manage Degree Types
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'DegreeTypeList':
                return <DegreeTypeList setSelectedDegreeType={setSelectedDegreeType} setShowComponent={setShowComponent} />;
            case 'AddDegreeType':
                return <AddDegreeType />;
            case 'EditDegreeType':
                return <EditDegreeType degreeType={selectedDegreeType} setShowComponent={setShowComponent} />;
            default:
                return <DegreeTypeList setSelectedDegreeType={setSelectedDegreeType} setShowComponent={setShowComponent} />;
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

            <h2 className="text-center m-5 px-2">Manage DegreeTypes</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'DegreeTypeList'}
                    onClick={() => setShowComponent('DegreeTypeList')}>
                    List All DegreeTypes
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddDegreeType'}
                    onClick={() => setShowComponent('AddDegreeType')}>
                    Add New Degree Type
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


const DegreeTypeList = ({ setSelectedDegreeType, setShowComponent }) => {
    const [degreeTypes, setDegreeTypes] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selected, setSelected] = useState('');
    const [refresh, setRefresh] = useState(false);
    const accessToken = getAccessToken();

    useEffect(() => {
        const fetchDegreeTypes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/degree-types/`, config);
                setDegreeTypes(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDegreeTypes();
    }, [accessToken, refresh]);

    useEffect(() => {
        setFilteredData(degreeTypes);
    }, [degreeTypes]);


    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = degreeTypes.filter(
            (degreeType) =>
                degreeType.name.toLowerCase().includes(keyword) ||
                degreeType.acronym.toLowerCase().includes(keyword) ||
                degreeType.code.toString().includes(keyword)
        );
        setFilteredData(filteredResults);
    };

    const handleEditModal = (degreeType) => {
        setSelectedDegreeType(degreeType);
        setShowEditModal(true);
    };

    const handleDeleteModal = (degreeType) => {
        setSelected(degreeType);
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
                        <i className="bi bi-pen"> </i>
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


const AddDegreeType = () => {
    const [name, setName] = useState('');
    const [acronym, setAcronym] = useState('');
    const [code, setCode] = useState(null);
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

            const newDegreeType = {
                name,
                acronym,
                code,
            };

            const response = await axios.post(`${API_BASE_URL}/academy/degree-types/`, newDegreeType, config);
            setAlertMessage('Degree type added successfully');
            setAlertType('success');

            // Clear the form
            setName('');
            setAcronym('');
            setCode('');

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
                    <label htmlFor="name" className="form-label">Degree Type Name</label>
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
                <button type="submit" className="btn btn-darkblue p-1 px-2 d-flex mx-auto">Add Degree Type</button>
            </form>

        </div>
    );
};


const EditDegreeType = () => {

}





export default ManageDegreeTypes;