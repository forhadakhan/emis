/**
 * Calling from: 
 *              academy/course-control/CourseDetails.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';


const Marksheet = ({ courseOffer, students }) => {
    const accessToken = getAccessToken();
    const [filteredData, setFilteredData] = useState([]);
    const [marksheets, setMarksheets] = useState([]);
    const [error, setError] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedMarksheet, setSelectedMarksheet] = useState('');
    const [relStudent, setRelStudent] = useState('');
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        setFilteredData(marksheets);
    }, [marksheets]);


    const fetchMarksheets = (courseOfferId) => {
        setError('');

        axios.get(`${API_BASE_URL}/academy/course-offer/marksheets/${courseOfferId}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setMarksheets(response.data);
            })
            .catch(error => {
                setError("Error fetching marksheets");
                console.error('Error fetching marksheets:', error);
            });
    };
    // Fetch marksheets when the component mounts
    useEffect(() => {
        fetchMarksheets(courseOffer.id);
    }, [accessToken, refresh]);


    const getStudent = (id) => {
        const student = students.find((stu) => stu.id === id)
        if (student) {
            const data = {
                name: `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}`,
                username: `${student.user.username}`,
                both: `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name} ${student.user.username}`,
            }
            return data;
        }
        return '';
    }


    const handleMarksControllerClick = (selected_marksheet, student) => {
        setSelectedMarksheet(selected_marksheet);
        setRelStudent(student);
        setShowUpdateModal(true);
    }


    const columns = [
        {
            name: 'Name & ID',
            selector: (row) => `${getStudent(row.course_enrollment.student).both} `,
            sortable: true,
            cell: (row) => (
                <div>
                    <strong className='d-block'>{getStudent(row.course_enrollment.student).name}</strong>
                    <small>{getStudent(row.course_enrollment.student).username}</small>
                </div>
            ),
            width: '21%',
        },
        {
            name: 'Attendance',
            selector: (row) => row.attendance,
            sortable: true,
            width: '',
        },
        {
            name: 'CT/Assignment',
            selector: (row) => row.assignment,
            sortable: true,
            width: '',
        },
        {
            name: 'Mid-term',
            selector: (row) => row.mid_term,
            sortable: true,
            width: '',
        },
        {
            name: 'Final',
            selector: (row) => row.final,
            sortable: true,
            width: '',
        },
        {
            name: 'Total',
            selector: (row) => row.attendance + row.assignment + row.mid_term + row.final,
            sortable: true,
            width: '',
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleMarksControllerClick(row, getStudent(row.course_enrollment.student))}
                > 
                    Update    
                    <i className="bi bi-pen px-1"></i>  
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
            },
        },
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = marksheets.filter(
            (ms) =>
                `${getStudent(ms.course_enrollment.student).both} `.toLowerCase().includes(keyword) || 
                `${ms.attendance} ${ms.assignment} ${ms.mid_term} ${ms.final}`.includes(keyword) || 
                `${ms.attendance + ms.assignment + ms.mid_term + ms.final}`.includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    return (
        <div>

            <h1 className='text-center fs-4'>
                <i className="bi bi-list-columns"> </i>
                Marksheet
            </h1>
            <p className='text-center'>
                <span className='badge bg-success mx-2 fw-normal'>Total Students: {students ? `${students.length}/${courseOffer.capacity}` : ''}</span>
            </p>

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
                        placeholder="Search ..."
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



                {showUpdateModal &&
                    <MarksControllerModal
                        show={showUpdateModal}
                        handleClose={() => setShowUpdateModal(false)}
                        marksheet={selectedMarksheet}
                        student={relStudent}
                        refresh={refresh}
                        setRefresh={setRefresh}
                    />}
            </div>

        </div>
    );
};


const MarksControllerModal = ({ show, handleClose, marksheet, student, refresh, setRefresh }) => {
    const { course_enrollment, ...updatedMS } = marksheet;
    const [updatedMarksheet, setUpdatedMarksheet] = useState(updatedMS);
    const [updateMessage, setUpdateMessage] = useState('');
    const accessToken = getAccessToken();
    const maxValue = 100;

    // for validation
    const getMaxValue = (field_name) => {
        switch (field_name) {
            case 'attendance':
                return 10;
            case 'assignment':
                return 20;
            case 'mid_term':
                return 30;
            case 'final':
                return 40;
            default:
                return 0;
        }
    }

    // validate marks
    const validateMarks = (data) => {
        const invalidFields = [];

        // Loop through each field in the data object and validate its value
        Object.keys(data).forEach((field) => {
            if (field === 'id' || field === 'course_enrollment') {
                return; // Skip 'id' and 'course_enrollment' fields
            }

            const value = parseInt(data[field], 10); // Convert the value to an integer

            if (isNaN(value) || value < 0 || value > getMaxValue(field)) {
                invalidFields.push(field);
                console.log(field);
            }
        });

        return invalidFields;
    }

    // handle marks input 
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validate the input value (should be between 0 and max value)
        if (value < 0 || value > getMaxValue(name)) {
            // If the input value is out of range, show an error message
            setUpdateMessage(`Wrong input! Range is 0 to ${getMaxValue(name)}`);
            return;
        }
        else {
            // Clear the error message if the input value is within the valid range
            setUpdateMessage('');

            setUpdatedMarksheet((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

    };

    // handle update marksheet 
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage('');

        // don't proceed if data not changed
        // as we are using required in input, this may not needed
        // if (JSON.stringify(updatedMarksheet) === JSON.stringify(marksheet)) {
        //     setUpdateMessage('No changes detected!');
        //     return;
        // }

        // validate data
        const invalidFields = validateMarks(updatedMarksheet);
        if (invalidFields.length > 0) {
            setUpdateMessage("Invalid input detected");
        }

        // make update request to api endpoint
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.patch(
                `${API_BASE_URL}/academy/marksheets/${updatedMarksheet.id}/`,
                updatedMarksheet,
                config
            );

            setUpdateMessage('Updated Successfully');
            setRefresh(!refresh); // reload the updated data in Marksheets 
        } catch (error) {
            setUpdateMessage('Update failed, an error occurred.');
            console.error(error);
        }
    };


    return (<>

        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content border border-beige">
                        <div className="modal-header bg-darkblue text-beige">
                            <h5 className="modal-title fs-4"><i className="bi bi-pen"></i> Update Marks </h5>
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='bg-beige m-2 p-2 rounded text-center'>
                                <strong className='d-block'>{student.name}</strong>
                                <small>{student.username}</small>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label htmlFor="attendance" className="form-label text-darkblue">Attendance</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 10'
                                        id="attendance"
                                        name="attendance"
                                        value={updatedMarksheet.attendance}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="assignment" className="form-label text-darkblue">CT/Assignment</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 20'
                                        id="assignment"
                                        name="assignment"
                                        value={updatedMarksheet.assignment}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="mid_term" className="form-label text-darkblue">Mid-term</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 30'
                                        id="mid_term"
                                        name="mid_term"
                                        value={updatedMarksheet.mid_term}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="final" className="form-label text-darkblue">Final</label>
                                    <input
                                        type="number"
                                        className="form-control border border-secondary"
                                        placeholder='0 to 40'
                                        id="final"
                                        name="final"
                                        value={updatedMarksheet.final}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-darkblue2 fw-medium d-flex mx-auto">Update</button>
                            </form>
                            {updateMessage && <div className='p-3 text-center'>{updateMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};


export default Marksheet;

