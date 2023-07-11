/**
* Calling from: Activity.jsx
* Calling to: 
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getFileLink, getUserId } from '../../../utils/auth';


const TeacherEnrollmentForm = ({ teacherId, teacher, departments, designations, handleAction, handleBack }) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [selectedDesignations, setSelectedDesignations] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [isEnrolled, setIsEnrollmented] = useState(false);
    const [onDuty, setOnDuty] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const accessToken = getAccessToken();
    const loggedUser = getUserId();

    if (teacher.enrollment && !enrollmentId) {
        setEnrollmentId(teacher.enrollment.id);
        setSelectedDesignations(teacher.enrollment.designations);
        setSelectedDepartments(teacher.enrollment.departments);
        setOnDuty(teacher.enrollment.on_duty);
        setIsEnrollmented(true);
    }

    const resetData = () => {
        setEnrollmentId(null);
        setSelectedDesignations([]);
        setSelectedDepartments([]);
        setIsEnrollmented(false);
        setOnDuty(false);
        setAlertMessage('');
    }

    const handleDepartmentSelect = (e) => {
        const departmentId = e.target.value;
        const selectedDepartment = departments.find(permission => permission.id === parseInt(departmentId));

        // Add the selected department to the list of selectedDepartments
        setSelectedDepartments(prevDepartments => {
            const alreadySelected = prevDepartments.find(department => department.id === selectedDepartment.id);
            if (!alreadySelected) {
                return [...prevDepartments, selectedDepartment];
            }
            return prevDepartments;
        });
    };

    const handleDesignationSelect = (e) => {
        const designationId = e.target.value;
        const selectedDesignation = designations.find(designation => designation.id === parseInt(designationId));

        // Add the selected designation to the list of selectedDesignations
        setSelectedDesignations(prevDesignations => {
            const alreadySelected = prevDesignations.find(designation => designation.id === selectedDesignation.id);
            if (!alreadySelected) {
                return [...prevDesignations, selectedDesignation];
            }
            return prevDesignations;
        });
    };

    const handleDepartmentRemove = (departmentId) => {
        setSelectedDepartments(prevDepartments => (
            prevDepartments.filter(department => department.id !== departmentId)
        ));
    }

    const handleDesignationRemove = (designationId) => {
        setSelectedDesignations(prevDesignations => (
            prevDesignations.filter(designation => designation.id !== designationId)
        ));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage('');

        // if there is no designation or department selected, return 
        if ((selectedDesignations.length === 0) || (0 === selectedDepartments.length)) {
            setAlertMessage('FAILED: You must select at least one designation and department.');
            return;
        }

        // if there is no change, return 
        if (isEnrolled && (teacher.enrollment.on_duty === onDuty) && ((teacher.enrollment.designations === selectedDesignations) && (selectedDepartments === teacher.enrollment.departments))) {
            setAlertMessage('FAILED: No midified data to save.');
            return;
        }

        let formData = {
            teacher: teacherId,
            designations: selectedDesignations.map(designation => designation.id),
            departments: selectedDepartments.map(department => department.id),
            on_duty: onDuty,
            ...(isEnrolled ? { updated_by: loggedUser } : { enrolled_by: loggedUser }),
        };

        console.log(formData);

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = isEnrolled
                ? await axios.patch(`${API_BASE_URL}/academy/teacher-enrollment/${enrollmentId}/`, JSON.stringify(formData), config)
                : await axios.post(`${API_BASE_URL}/academy/teacher-enrollment/`, JSON.stringify(formData), config);

            setShowSuccessModal(true);
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) =>
                        Array.isArray(errorArray)
                            ? errorArray.map((error) => `[${key}] ${error}`)
                            : typeof errorArray === 'object'
                                ? [`[${key}] ${Object.values(errorArray).join(' ')}`]
                                : [`[${key}] ${errorArray}`]
                    )
                    .join('\n');

                setAlertMessage(
                    errorMessages ? `Failed to submit data,\n${errorMessages}` : 'Failed to submit data. Please try again.'
                );
            } else {
                setAlertMessage('Failed to submit data. Please try again.');
            }
            console.error(error);
        }
    };

    const handleEnrollmentDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.delete(`${API_BASE_URL}/academy/teacher-enrollment/${enrollmentId}/`, config);
            handleAction();
        } catch (error) {
            setAlertMessage('Failed to remove enrollment. Please try again.');
            console.error(error);
        }
    };


    return (
        <div className="">

            {teacher && <>
                <a className="icon-link icon-link-hover" href="#" onClick={handleBack}>
                    <i className="bi bi-arrow-bar-left"></i> Teacher List
                </a>

                <div className="col-sm-12 col-md-8 mx-auto my-5">
                    <div className="row g-0">
                        <div className="col-md-3">
                            {teacher.photo_id ? (
                                <img src={getFileLink(teacher.photo_id)} className="img-fluid rounded mx-auto d-flex border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }} alt="..." />
                            ) : (
                                <div className="rounded-2 mx-auto bg-darkblue text-beige" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }}>
                                    <i className="bi bi-person-bounding-box fs-1"></i>
                                </div>
                            )}
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="ms-3">
                                <p><span className="badge bg-darkblue text-beige">{teacher.acronym}</span></p>
                                {teacher.user && <>
                                    <h4 className="">{`${teacher.user.first_name} ${teacher.user.middle_name} ${teacher.user.last_name}`}</h4>
                                    <h5 className="fs-6 text-body-secondary"><i className="bi bi-person-fill"></i> {teacher.user.username}</h5>
                                    <h5 className="fs-6 text-body-secondary"><i className="bi bi-envelope-fill"></i> {teacher.user.email}</h5>
                                </>}
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-telephone-fill"></i> {teacher.phone}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </>}

            <form className='mb-5' onSubmit={handleSubmit}>
                <h4 className='text-center m-5'><span className='badge bg-white text-secondary border p-2'>Enrollment Form</span></h4>

                <div className="mb-3 row">
                    {/* <label htmlFor="dept" className="form-label">Department(s):</label> */}
                    <div className="">
                        <select value='' onChange={handleDepartmentSelect} id="dept" className="form-select bg-darkblue text-beige" aria-label="Departments">
                            <option value="">Select department(s)</option>
                            {departments && departments.map(department => (
                                <option key={department.id} value={department.id} className=''>
                                    {department.acronym} {department.code} - {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {selectedDepartments && selectedDepartments.length === 0 && (
                    <h5 className='text-center p-3 pb-4'>No department(s) selected.</h5>
                )}
                {selectedDepartments && selectedDepartments.length > 0 && (
                    <div className="mb-3 row">
                        <label htmlFor="selectedDepartments" className="form-label">Selected Departments:</label>
                        <div className="p-2 rounded-1">
                            {selectedDepartments.map(department => (
                                <div key={department.id} id="selectedDepartments" className="bg-beige text-darkblue d-inline-block border rounded-3 m-1 p-2">
                                    <span>{department.acronym} {department.code} </span>
                                    <span className='hoss'> - {department.name}</span>
                                    <button
                                        type="button"
                                        className="btn border-0 border-start p-0 m-0 ms-2"
                                        onClick={() => handleDepartmentRemove(department.id)}
                                    >
                                        <i className="bi bi-x-lg px-2"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-3 row">
                    {/* <label htmlFor="designation" className="form-label">Designation(s):</label> */}
                    <div className="">
                        <select value='' onChange={handleDesignationSelect} id="designation" className="form-select bg-darkblue text-beige" aria-label="Departments">
                            <option value="">Select designation(s)</option>
                            {designations && designations.map(designation => (
                                <option key={designation.id} value={designation.id} className=''>
                                    {designation.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {selectedDesignations && selectedDesignations.length === 0 && (
                    <h5 className='text-center p-3 pb-4'>No designation(s) selected.</h5>
                )}
                {selectedDesignations && selectedDesignations.length > 0 && (
                    <div className="mb-3 row">
                        <label htmlFor="selectedDesignations" className="form-label">Selected Designations:</label>
                        <div className="p-2 rounded-1">
                            {selectedDesignations.map(designation => (
                                <div key={designation.id} id="selectedDesignations" className="bg-beige text-darkblue d-inline-block border rounded-3 m-1 p-2">
                                    <span>{designation.name}</span>
                                    <button
                                        type="button"
                                        className="btn border-0 border-start p-0 m-0 ms-2"
                                        onClick={() => handleDesignationRemove(designation.id)}
                                    >
                                        <i className="bi bi-x-lg px-2"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="input-group bg-darkblue text-beige p-1 rounded">
                    <label htmlFor='onDuty' className="form-check-label pt-1 me-3 ms-2">On Duty? </label>
                    <div className="form-check form-switch">
                        <input className="form-check-input p-2 border border-darkblue" defaultChecked={onDuty} onClick={() => setOnDuty(!onDuty)} type="checkbox" role="switch" id="onDuty" style={{ width: '3em', height: '1.5em' }} />
                    </div>
                </div>


                {alertMessage && (
                    <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                        <strong>{alertMessage}</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                    </div>
                )}

                <div className="btn-group gap-1 d-flex justify-content-equal mt-5 px-5">
                    <button className='btn btn-darkblue2 btn-lg p-1 px-2' type='submit'><i className="bi bi-sd-card"> </i> Save </button>

                    {isEnrolled &&
                        <button className='btn btn-danger btn-sm p-1 px-2' onClick={() => setIsDelete(!isDelete)} type='button'><i className="bi bi-trash"> </i> Remove </button>
                    }
                </div>


                {isDelete &&
                    <div className="container d-flex align-items-center justify-content-center">
                        <div className="alert alert-warning border border-danger p-2 my-3" role="alert">
                            <h6 className='text-center me-2 d-inline'>Are  you sure?</h6>
                            <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-danger" onClick={handleEnrollmentDelete}> Yes </button>
                                <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(false)}> No </button>
                            </div>
                        </div>
                    </div>}

            </form>

            <button className="btn btn-sm border btn-dark d-flex mx-auto" onClick={resetData} type='button'> Reset </button>


            {showSuccessModal && (
                <div className="bg-blur">
                    <div className={`modal ${showSuccessModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content bg-darkblue border border-beige text-beige">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-4"><i className="bi bi-check-circle-fill"></i> Saved </h5>
                                    <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={() => { setShowSuccessModal(false), handleAction() }}>
                                        <i className="bi bi-x-lg"></i>
                                    </button>
                                </div>
                                <div className="modal-body text-center fw-bold">
                                    Saved successfully
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};




export default TeacherEnrollmentForm;