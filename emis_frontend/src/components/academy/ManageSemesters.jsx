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
    
};


const SemesterDetail = ({ semester, programs, termChoices }) => {
    
};


export default ManageSemesters;
