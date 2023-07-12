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
    
};


const SemesterList = ({ semesterDetail, programs, termChoices }) => {

};


const SemesterDetail = ({ semester, programs, termChoices }) => {
    
};


export default ManageSemesters;
