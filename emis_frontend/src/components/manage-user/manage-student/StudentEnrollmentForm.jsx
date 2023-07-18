/**
* Calling from: StudentController.jsx
* Calling to: 
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getFileLink, getUserId } from '../../../utils/auth.js';
import { getOrdinal } from '../../../utils/utils.js';
import Select from 'react-select'


const StudentEnrollmentForm = ({ studentId, student, programs, semesters, batches, handleAction, handleBack }) => {
    const accessToken = getAccessToken();
    const loggedUser = getUserId();
    const yearChoices = [
        { value: 'FR', label: 'Freshman' },
        { value: 'SO', label: 'Sophomore' },
        { value: 'JR', label: 'Junior' },
        { value: 'SR', label: 'Senior' },
        { value: 'GR', label: 'Graduate' },
    ];
    const initForm = {
        year: yearChoices[0].value,
        student: studentId,
        batch_section: '',
        semester: '',
        enrolled_by: loggedUser,
        is_active: true,
    }
    const [alertMessage, setAlertMessage] = useState('');
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [isEnrolled, setIsEnrollmented] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState(initForm);
    const [selectedYear, setSelectedYear] = useState(yearChoices[0]);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [batchOptions, setBatchOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);

    
    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.degree_type.acronym} in ${program.name}`
    }));

    const semestermOptions = semesters.map(semester => ({
        value: semester.id,
        isDisabled: !semester.is_open,
        label: `${semester.term.name} ${semester.year} (${semester.term.start} to ${semester.term.end})`
    }));

    const setEnrollmentData = () => {
        setEnrollmentId(student.enrollment.id);
        const data = {
            student: student.enrollment.student,
            year: student.enrollment.year,
            semester: student.enrollment.semester,
            enrolled_by: student.enrollment.enrolled_by.id,
            updated_by: loggedUser,
            batch_section: student.enrollment.batch_section.id,
            is_active: student.enrollment.is_active,
        }
        setFormData(data)
        const year = yearChoices.find((year) => year.value === student.enrollment.year);
        const sectionId = data.batch_section;
        const batchId = student.enrollment.batch_section.batch;
        // const programId = student.enrollment.batch_section.batch_data.program;
        // const program = programs.find((program) => program.id === programId);
        const semester = semesters.find((semester) => semester.id === data.semester);
        const batch = batches.find((batch) => batch.id === batchId);
        const section = batch.sections.find((section) => section.id === sectionId);
        setSelectedYear(year);
        // setSelectedProgram({ value:programId, label: `${program.acronym} ${program.code}: ${program.name}` });
        setSelectedBatch({ isDisabled: true, value: batchId, label: `${batch.program.acronym} ${getOrdinal(batch.number)} (Session: ${batch.session})` });
        setSelectedSection({ isDisabled: true, value: sectionId, label: `${section.name} (${section.available_seats}/${section.max_seats})` });
        setSelectedSemester( semester 
            ? { 
                isDisabled: true, 
                value: data.semester, 
                label: `${semester.term.name} ${semester.year} (${semester.term.start} to ${semester.term.end})` } 
            : {
                isDisabled: true, 
                value: '', 
                label: `Enrolled semester may be closed.`

            });        
        setIsEnrollmented(true);
    }

    const resetData = () => {
        if (student.enrollment && !enrollmentId) {
            setEnrollmentData();
        } else {
            setEnrollmentId(null);
            setIsEnrollmented(false);
            setAlertMessage('');
            setSelectedProgram('');
            setSelectedBatch('');
            setSelectedSection('');
            setSelectedSemester('');
            setBatchOptions([]);
            setSectionOptions([]);
        }
    }

    if (student.enrollment && !enrollmentId) {
        setEnrollmentData();
    }

    const handleSemesterChange = (selectedOption) => {
        setSelectedSemester(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, semester: parseInt(selectedOption.value) });
        }
    };

    const handleProgramChange = (selectedOption) => {
        setSelectedProgram(selectedOption);
        setSelectedBatch('');
        const filteredBatches = batches.filter(batch => batch.program.id === selectedOption.value);
        if (filteredBatches) {
            const batchOptions = filteredBatches.map(batch => ({
                value: batch.id,
                label: `${batch.program.acronym} ${getOrdinal(batch.number)} (Session: ${batch.session})`
            }));
            setBatchOptions(batchOptions.length > 0 ? batchOptions : [{ isDisabled: true, label: 'No batches found for selected program' }]);
        } else {
            setBatchOptions([{ isDisabled: true, label: 'No batches found for selected program' }]);
        }
    };

    const handleBatchChange = (selectedOption) => {
        setSelectedBatch(selectedOption);
        setSelectedSection('');
        const batch = batches.find((batch) => batch.id === selectedOption.value);
        const sections = batch.sections;
        if (sections) {
            const sectionOptions = sections.map(section => ({
                value: section.id,
                label: `${section.name} (${section.available_seats}/${section.max_seats})`
            }));
            setSectionOptions(sectionOptions.length > 0 ? sectionOptions : [{ isDisabled: true, label: 'No section found for this batch' }]);
        } else {
            setSectionOptions([{ isDisabled: true, label: 'No section found for this batch.' }]);
        }

    };


    const handleSectionChange = (selectedOption) => {
        setSelectedSection(selectedOption);
        if (parseInt(selectedOption.value)) {
            setFormData({ ...formData, batch_section: parseInt(selectedOption.value) });
        }
    }

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption);
        setFormData({ ...formData, year: selectedOption.value });
    }

    const handleActiveSwitch = (status) => {
        setFormData({ ...formData, is_active: status });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage('');

        // if no section selected, return 
        if (!(selectedSection && formData.batch_section)) {
            setAlertMessage('Failed. You must select a valid section');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = isEnrolled
                ? await axios.patch(`${API_BASE_URL}/academy/student-enrollment/${enrollmentId}/`, JSON.stringify(formData), config)
                : await axios.post(`${API_BASE_URL}/academy/student-enrollment/`, JSON.stringify(formData), config);

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
            const response = await axios.delete(`${API_BASE_URL}/academy/student-enrollment/${enrollmentId}/`, config);
            handleAction();
        } catch (error) {
            setAlertMessage('Failed to remove enrollment. Please try again.');
            console.error(error);
        }
    };


    return (
        <div className="">

            {student && <>
                <a className="icon-link icon-link-hover" href="#" onClick={handleBack}>
                    <i className="bi bi-arrow-bar-left"></i> Student List
                </a>

                <div className="col-sm-12 col-md-8 mx-auto my-5">
                    <div className="row g-0">
                        <div className="col-md-3">
                            <div className={`rounded-2 mx-auto ${student.photo_id ? '' : 'bg-darkblue'} text-beige`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }}>
                                {student.photo_id ? (
                                    <img src={getFileLink(student.photo_id)} className="img-fluid rounded mx-auto d-flex border" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '200px', height: '200px', }} alt="..." />
                                ) : (
                                    <i className="bi bi-person-bounding-box fs-1"></i>
                                )}
                            </div>
                        </div>
                        <div className="col-md-9 p-3">
                            <div className="ms-5">
                                {student.user && <>
                                    <h4 className="">{`${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}`}</h4>
                                    <h5 className="fs-6 text-body-secondary"><i className="bi bi-person-fill"></i> {student.user.username}</h5>
                                    <h5 className="fs-6 text-body-secondary"><i className="bi bi-envelope-fill"></i> {student.user.email}</h5>
                                </>}
                                <h5 className="fs-6 text-body-secondary"><i className="bi bi-telephone-fill"></i> {student.phone}</h5>

                                {enrollmentId && isEnrolled && <>
                                    {student.enrollment.enrolled_by &&
                                        <small className='d-block text-secondary'>Enrolled by: {student.enrollment.enrolled_by.username}</small>}
                                    {student.enrollment.updated_by &&
                                        <small className='d-block text-secondary'>Last updated by: {student.enrollment.updated_by.username}</small>}
                                </>}

                            </div>
                        </div>
                    </div>
                </div>
            </>}

            <form className='mb-5' onSubmit={handleSubmit}>
                <h4 className='text-center m-5'><span className='badge bg-white text-secondary border p-2'>Enrollment Form</span></h4>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Year: </label>
                    <Select
                        options={yearChoices}
                        isMulti={false}
                        value={selectedYear}
                        onChange={handleYearChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Semester: </label>
                    <Select
                        options={semestermOptions}
                        isMulti={false}
                        value={selectedSemester}
                        placeholder='Running Semesters'
                        onChange={handleSemesterChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Program: </label>
                    <Select
                        options={programOptions}
                        isMulti={false}
                        value={selectedProgram}
                        onChange={handleProgramChange}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Batch: </label>
                    <Select
                        options={batchOptions}
                        isMulti={false}
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        isDisabled={batchOptions.length < 1}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-2  mx-auto">
                    <label className="text-secondary py-1">Section: </label>
                    <Select
                        options={sectionOptions}
                        isMulti={false}
                        value={selectedSection}
                        onChange={handleSectionChange}
                        isDisabled={sectionOptions.length < 1}
                    />
                </div>

                <div className="col-sm-12 col-md-8 my-4  mx-auto">
                    <div className="input-group rounded">
                        <label htmlFor='isActive' className="form-check-label me-3 ms-2">Active Status: </label>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input p-2 border border-darkblue"
                                defaultChecked={formData.is_active}
                                onClick={() => handleActiveSwitch(!(formData.is_active))}
                                type="checkbox"
                                role="switch"
                                id="isActive"
                                style={{ width: '5em', height: '1em' }}
                            />
                        </div>
                    </div>
                </div>


                <div className="col-sm-12 col-md-8 my-4  mx-auto">
                    {alertMessage && (
                        <div className={`alert alert-warning border border-secondary alert-dismissible fade show mt-3`} role="alert">
                            <strong>{alertMessage}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                        </div>
                    )}

                    <div className="btn-group gap-1 d-flex justify-content-equal mt-5 px-5">
                        <button className='btn btn-darkblue2 p-1 px-2' type='submit'><i className="bi bi-sd-card"> </i> Save </button>

                        {isEnrolled &&
                            <button className='btn btn-danger btn-sm p-1 px-2' onClick={() => setIsDelete(!isDelete)} type='button'><i className="bi bi-trash"> </i> Remove </button>
                        }
                    </div>


                    {isDelete &&
                        <div className="container d-flex align-items-center justify-content-center">
                            <div className="alert alert-warning border border-danger p-2 my-3" role="alert">
                                <h6 className='text-center me-2 d-inline'>Are  you sure?</h6>
                                <div className="btn-group text-center mx-auto" role="group" aria-label="Delete">
                                    <button type="button" className="btn btn-danger" onClick={handleEnrollmentDelete}> Yes </button>
                                    <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(false)}> No </button>
                                </div>
                            </div>
                        </div>}
                </div>
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

        </div>
    );
};




export default StudentEnrollmentForm;

