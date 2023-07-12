/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';


const ManageSemesters = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('SemesterList');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [programs, setPrograms] = useState([]);
    const [termChoices, setTermChoices] = useState([]);
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageSemesters')}>
            <i className="bi bi-calendar2-range-fill"></i> Manage Semesters
        </button>
    );

    // fetch term-choices for select 
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

                const response = await axios.get(`${API_BASE_URL}/academy/term-choices/`, config);
                setTermChoices(response.data);
            } catch (error) {
                setError(' Failed to fetch programs/term-choices list.');
                console.error(error);
            }
        };

        if (termChoices.length === 0) {
            fetchDepartments();
        }

    }, []);

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
                setError(' Failed to fetch programs/term-choices list.');
                console.error(error);
            }
        };

        if (programs.length === 0) {
            fetchDepartments();
        }

    }, []);

    const semesterDetail = (semester) => {
        setSelectedSemester(semester);
        setShowComponent('SemesterDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'SemesterList':
                return <SemesterList semesterDetail={semesterDetail} programs={programs} termChoices={termChoices} />;
            case 'AddSemester':
                return <AddSemester programs={programs} termChoices={termChoices} />;
            case 'SemesterDetails':
                return <SemesterDetail semester={selectedSemester} programs={programs} termChoices={termChoices} />;
            default:
                return <SemesterList semesterDetail={semesterDetail} programs={programs} termChoices={termChoices} />;
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

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Semesters</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'SemesterList'}
                    onClick={() => setShowComponent('SemesterList')}>
                    List All Semesters
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddSemester'}
                    onClick={() => setShowComponent('AddSemester')}>
                    Add New Semester
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


const AddSemester = ({ programs, termChoices }) => {
    const accessToken = getAccessToken();
    const form = {
        term: '',
        year: '',
        code: '',
        is_open: true,
        is_finished: false,
        programs: [],
    }
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(form);
    const [selectedPrograms, setSelectedPrograms] = useState([]);

    useEffect(() => {
        const programIds = selectedPrograms.map(program => program.id);
        setFormData({ ...formData, programs: programIds });
    }, [selectedPrograms])


    const handleProgramSelect = (e) => {
        const programId = e.target.value;
        const selectedProgram = programs.find(permission => permission.id === parseInt(programId));

        // Add the selected program to the list of selectedPrograms
        setSelectedPrograms(prevPrograms => {
            const alreadySelected = prevPrograms.find(program => program.id === selectedProgram.id);
            if (!alreadySelected) {
                return [...prevPrograms, selectedProgram];
            }
            return prevPrograms;
        });
    };

    const handleProgramRemove = (programId) => {
        setSelectedPrograms(prevPrograms => (
            prevPrograms.filter(program => program.id !== programId)
        ));
    }


    const handleAllSelect = () => {
        // Check if all programs are already selected
        const allSelected = programs.every(program => selectedPrograms.some(selected => selected.id === program.id));

        // Add all programs to the list of selectedPrograms if not already selected
        if (!allSelected) {
            setSelectedPrograms(prevPrograms => [...prevPrograms, ...programs]);
        }
    };



    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const setIsOpen = () => {
        let open = formData.is_open;
        setFormData({ ...formData, is_open: !open });
    }

    const setFinished = () => {
        let finished = formData.is_finished;
        setFormData({ ...formData, is_finished: !finished });
    }


    const resetForm = () => {
        setFormData(form);
        setSelectedPrograms([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/semesters/`, formData, config);
            // clear form
            resetForm();
            setMessage('Semester added successfully.');
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
                    setError(`Error creating semester. \n${errorMessages}`);
                } else {
                    setError('Error creating semester. Please try again.');
                }
            } else {
                setError('Error creating semester. Please try again.');
            }
            setMessage('');
            console.error('Error creating semester:', error);
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
                            <label className="text-secondary py-1">Term:</label>
                            <div className="">
                                <select value={formData.term} name="term" onChange={handleInputChange} id="term" className="form-select" aria-label="Programs" required>
                                    <option value="">Select a term:</option>
                                    {termChoices && termChoices.map(termChoice => (
                                        <option key={termChoice.id} value={termChoice.id} className='bg-darkblue text-beige'>
                                            {termChoice.name}: {termChoice.start} - {termChoice.end}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Year:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="year"
                                value={formData.year}
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
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label htmlFor="programs" className="form-label">Program(s):</label>
                            <div className="">
                                <select value='' onChange={handleProgramSelect} id="programs" className="form-select" aria-label="Programs">
                                    <option value="">Select program(s)</option>
                                    {programs && programs.map(program => (
                                        <option key={program.id} value={program.id} className='bg-darkblue text-beige'>
                                            {program.acronym} {program.code} - {program.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {selectedPrograms && selectedPrograms.length === 0 && (
                            <>
                                <h5 className='text-center col-sm-12 col-md-8 my-2 fs-6 text-secondary mx-auto'>No program(s) selected.</h5>
                                <button className="btn btn-link" type='button' onClick={handleAllSelect}>Select all</button>
                            </>
                        )}
                        {selectedPrograms && selectedPrograms.length > 0 && (
                            <div className="col-sm-12 col-md-8 my-2  mx-auto">
                                <label htmlFor="selectedPrograms" className="form-label text-secondary">
                                    Selected Programs 
                                    (<button className="btn btn-link p-0 pb-1" type='button' onClick={() => setSelectedPrograms([])}>remove all</button>)</label>
                                <div className="p-2 rounded-1">
                                    {selectedPrograms.map(program => (
                                        <div key={program.id} id="selectedPrograms" className="bg-beige text-darkblue d-inline-block border rounded-3 m-1 p-2">
                                            <span>{program.acronym} {program.code} </span>
                                            <span className='hoss'> - {program.name}</span>
                                            <button
                                                type="button"
                                                className="btn border-0 border-start p-0 m-0 ms-2"
                                                onClick={() => handleProgramRemove(program.id)}
                                            >
                                                <i className="bi bi-x-lg px-2"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <div className="input-group p-1 rounded">
                                <label htmlFor='open' className="form-check-label me-3 ms-2 fw-bold">Open? </label>
                                <div className="form-check form-switch">
                                    <input className="form-check-input p-2 border border-darkblue" defaultChecked={formData.is_open} value={formData.is_open} onClick={() => setIsOpen()} type="checkbox" role="switch" id="open" style={{ width: '6em', height: '1em' }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <div className="input-group p-1 rounded">
                                <label htmlFor='finished' className="form-check-label me-3 ms-2 fw-bold">Finished? </label>
                                <div className="form-check form-switch">
                                    <input className="form-check-input p-2 border border-darkblue" defaultChecked={formData.is_finished} value={formData.is_finished} onClick={() => setFinished()} type="checkbox" role="switch" id="finished" style={{ width: '6em', height: '1em' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Semester</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const SemesterList = ({ semesterDetail, programs, termChoices }) => {
    const accessToken = getAccessToken();
    const [semesters, setSemesters] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        setFilteredData(semesters);
    }, [semesters]);

    const fetchSemesters = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/semesters/`, config);
            setSemesters(response.data);
        } catch (error) {
            setError(' Failed to fetch semesters list.');
            console.error('Error fetching semesters:', error);
        }
    };

    const handleSemesterClick = (semester) => {
        semesterDetail(semester);
    };

    const getTerm = (id) => {
        const term = termChoices.find(trem => trem.id === id);

        if (term) return term.name;

        return ''; // Return null if no data with the given ID is found
    }


    const columns = [
        {
            name: 'Term',
            selector: (row) => `${getTerm(row.term)}`,
            sortable: true,
        },
        {
            name: 'Year',
            selector: (row) => row.year,
            sortable: true,
        },
        {
            name: 'Code',
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: 'Open',
            selector: (row) => row.is_open ? 'Yes' : 'No',
            sortable: true,
        },
        {
            name: 'Finished',
            selector: (row) => row.is_finished ? 'Yes' : 'No',
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleSemesterClick(row)}
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
        const filteredResults = semesters.filter(
            (semester) =>
                getTerm(semester.term).toLowerCase().includes(keyword) ||
                semester.year.toString().toLowerCase().includes(keyword) ||
                semester.code.toString().toLowerCase().includes(keyword) ||
                ((semester.is_open && (keyword === 'open')) ||
                    (!semester.is_open && (keyword === '!open' || keyword === 'not open'))) ||
                ((semester.is_finished && (keyword === 'finished')) ||
                    (!semester.is_finished && (keyword === '!finished' || keyword === 'not finished')))
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
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="open">Open</option>
                    <option value="!open">Not Open</option>
                    <option value="finished">Finished</option>
                    <option value="!finished">Not Finished</option>
                </select>
            </div>

            <div className="m-5">
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


const SemesterDetail = ({ semester, programs, termChoices }) => {
    const accessToken = getAccessToken();
    const [formData, setFormData] = useState(semester);
    const [isEditing, setIsEditing] = useState(false);
    const [deactive, setDeactive] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');
    const [selectedPrograms, setSelectedPrograms] = useState([]);


    useEffect(() => {
        // Filter out programs based on IDs from semester.programs
        const filteredPrograms = programs.filter(program => semester.programs.includes(program.id));
        setSelectedPrograms(filteredPrograms);
    }, [])

    useEffect(() => {
        const programIds = selectedPrograms.map(program => program.id);
        setFormData({ ...formData, programs: programIds });
    }, [selectedPrograms])

    const handleProgramSelect = (e) => {
        const programId = e.target.value;
        const selectedProgram = programs.find(permission => permission.id === parseInt(programId));

        // Add the selected program to the list of selectedPrograms
        setSelectedPrograms(prevPrograms => {
            const alreadySelected = prevPrograms.find(program => program.id === selectedProgram.id);
            if (!alreadySelected) {
                return [...prevPrograms, selectedProgram];
            }
            return prevPrograms;
        });
    };

    const handleProgramRemove = (programId) => {
        setSelectedPrograms(prevPrograms => (
            prevPrograms.filter(program => program.id !== programId)
        ));
    }


    const handleAllSelect = () => {
        // Check if all programs are already selected
        const allSelected = programs.every(program => selectedPrograms.some(selected => selected.id === program.id));

        // Add all programs to the list of selectedPrograms if not already selected
        if (!allSelected) {
            setSelectedPrograms(prevPrograms => [...prevPrograms, ...programs]);
        }
    };


    const setIsOpen = () => {
        let open = formData.is_open;
        setFormData({ ...formData, is_open: !open });
    }

    const setFinished = () => {
        let finished = formData.is_finished;
        setFormData({ ...formData, is_finished: !finished });
    }


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const resetForm = () => {
        setFormData(semester);
        setSelectedPrograms([]);
    };


    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSuccessMessage('');
        setFailedMessage('');
    };

    const handleUpdate = async () => {
        setSuccessMessage('');
        setFailedMessage('');

        if (JSON.stringify(semester) === JSON.stringify(formData)) {
            setFailedMessage('No changes to update.');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }

        try {
            await axios.patch(`${API_BASE_URL}/academy/semesters/${semester.id}/`, formData, config);
            setIsEditing(false);
            setDeactive(true);
            setSuccessMessage('Semester updated successfully.');
        } catch (error) {
            setFailedMessage('Semester update failed. Please try again later.');
            console.error('Error updating semester:', error);
        }
    };

    const handleDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        try {
            await axios.delete(`${API_BASE_URL}/academy/semesters/${semester.id}/`, config);
            setSuccessMessage('Semester deleted successfully.');
            setDeactive(true);
            setIsDelete(false);
        } catch (error) {
            setFailedMessage('Semester deletion failed. Please try again later.');
            console.error('Error deleting semester:', error);
        }
    };

    return (
        <div className='mb-5 pb-5'>
            <h2 className='text-center font-merriweather'>
                <span className="badge bg-white p-2 fw-normal text-secondary fs-6 border border-beige">Semester Detail</span>
            </h2>
            <div className='d-flex'>
                <button type="button" disabled={deactive} className="btn btn-darkblue2 ms-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={handleEditToggle}><i className='bi bi-pen'></i></button>
                <button type="button" disabled={deactive} className="btn btn-danger me-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={() => setIsDelete(!isDelete)}><i className='bi bi-trash'></i></button>
            </div>
            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this user?</h6>
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
                        <label className="text-secondary py-1">Term:</label>
                        <div className="">
                            <select value={formData.term} disabled={!isEditing} name="term" onChange={handleInputChange} id="term" className="form-select" aria-label="Programs" required>
                                <option value="">Select a term:</option>
                                {termChoices && termChoices.map(termChoice => (
                                    <option key={termChoice.id} value={termChoice.id} className='bg-darkblue text-beige'>
                                        {termChoice.name}: {termChoice.start} - {termChoice.end}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Year:</label>
                        <input
                            type="number"
                            className="form-control"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <label htmlFor="programs" className="form-label">Program(s):</label>
                        <div className="">
                            <select value='' disabled={!isEditing} onChange={handleProgramSelect} id="programs" className="form-select" aria-label="Programs">
                                <option value="">Select program(s)</option>
                                {programs && programs.map(program => (
                                    <option key={program.id} value={program.id} className='bg-darkblue text-beige'>
                                        {program.acronym} {program.code} - {program.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {selectedPrograms && selectedPrograms.length === 0 && (
                        <>
                            <h5 className='text-center col-sm-12 col-md-8 my-2 fs-6 text-secondary mx-auto'>No program(s) selected.</h5>
                            <button className="btn btn-link" disabled={!isEditing} type='button' onClick={handleAllSelect}>Select all</button>
                        </>
                    )}
                    {selectedPrograms && selectedPrograms.length > 0 && (
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label htmlFor="selectedPrograms" className="form-label text-secondary">Selected Programs (<button className="btn btn-link p-0 pb-1" disabled={!isEditing} type='button' onClick={() => setSelectedPrograms([])}>remove all</button>)</label>
                            <div className="p-2 rounded-1">
                                {selectedPrograms.map(program => (
                                    <div key={program.id} id="selectedPrograms" className="bg-beige text-darkblue d-inline-block border rounded-3 m-1 p-2">
                                        <span>{program.acronym} {program.code} </span>
                                        <span className='hoss'> - {program.name}</span>
                                        {isEditing &&
                                            <button
                                                type="button"
                                                disabled={!isEditing}
                                                className="btn border-0 border-start p-0 m-0 ms-2"
                                                onClick={() => handleProgramRemove(program.id)}
                                            >
                                                <i className="bi bi-x-lg px-2"></i>
                                            </button>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <div className="input-group p-1 rounded">
                            <label htmlFor='open' className="form-check-label me-3 ms-2 fw-bold">Open? </label>
                            <div className="form-check form-switch">
                                <input disabled={!isEditing} className="form-check-input p-2 border border-darkblue" defaultChecked={formData.is_open} value={formData.is_open} onClick={() => setIsOpen()} type="checkbox" role="switch" id="open" style={{ width: '6em', height: '1em' }} />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <div className="input-group p-1 rounded">
                            <label htmlFor='finished' className="form-check-label me-3 ms-2 fw-bold">Finished? </label>
                            <div className="form-check form-switch">
                                <input disabled={!isEditing} className="form-check-input p-2 border border-darkblue" defaultChecked={formData.is_finished} value={formData.is_finished} onClick={() => setFinished()} type="checkbox" role="switch" id="finished" style={{ width: '6em', height: '1em' }} />
                            </div>
                        </div>
                    </div>
                </div>
                {isEditing && <>
                    <button type="button" className="btn btn-darkblue2 mx-auto m-4 d-flex" onClick={handleUpdate}>Update</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </>}
            </form>
        </div>
    );
};


export default ManageSemesters;
