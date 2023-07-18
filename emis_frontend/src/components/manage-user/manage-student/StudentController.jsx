/**
* Calling from: TeacherEnrollment.jsx; ManageTeacher.jsx; 
* Calling to: StudentEnrollmentForm.jsx;
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId } from '../../../utils/auth';
import DataTableList from './DataTableList';
import StudentEnrollmentForm from './StudentEnrollmentForm.jsx';


const StudentController = ({ setActiveComponent, setReference, hideProfile }) => {
    const accessToken = getAccessToken();
    const [enrollComponent, setEnrollComponent] = useState('');
    const [user, setUser] = useState('');
    const [studentUsers, setStudentUsers] = useState([]);
    const [student, setStudent] = useState('');
    const [studentId, setStudentId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [batches, setBatches] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [semesters, setSemesters] = useState([]);
    

    const resetCache = () => {
        setUser('');
        setStudent('');
        setStudentId(null);
        setEnrollComponent('');
    }


    const handleBack = async () => {
        setEnrollComponent('DataTableList');
        resetCache();
    };

    const fetchStudent = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    reference: user,
                },
            };

            const response = await axios.get(`${API_BASE_URL}/student/profile/`, config);
            const data = response.data;
            setStudentId(data.pk);
            setStudent(data.fields);
            if (data.fields.enrollment) {
                setEnrollComponent("EnrollmentForm");
            } else {
                setEnrollComponent("EnrollmentForm");
            }
        } catch (error) {
            setAlertMessage('An error occurred while fetching the student.');
            console.error(error);
        }
    };

    // when an enrollment is changed, re-fetch the student and set enrollment form
    const handleAction = async () => {
        setEnrollComponent('Dummy');
        await fetchStudent(); // wait for fetchTeacher to complete before proceeding
        setTimeout(() => {
            setEnrollComponent('EnrollmentForm');
        }, 100);
    };

    // fetch  users with 'student' role for DataTable
    useEffect(() => {
        setAlertMessage('');
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/student/users/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStudentUsers(response.data);
            } catch (error) {
                setAlertMessage('Error fetching student users');
                console.error('Error fetching student users:', error);
            }
        };
        fetchUserData();
    }, []);

    // fetch batches for select at EnrollmentForm
    useEffect(() => {
        setAlertMessage('');
        const fetchDepartments = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/active-batches/`, config);
                setBatches(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching available batches list.');
                console.error(error);
            }
        };

        if (batches.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch programs for select at EnrollmentForm
    useEffect(() => {
        setAlertMessage('');
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
                setAlertMessage('An error occurred while fetching available programs list.');
                console.error(error);
            }
        };

        if (programs.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch semester for select at EnrollmentForm
    useEffect(() => {
        setAlertMessage('');
        const fetchSemesters = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/open-semesters/`, config);
                setSemesters(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching open semesters list.');
                console.error(error);
            }
        };

        if (semesters.length === 0) {
            fetchSemesters();
        }

    }, []);


    // fetch student data when a user is selected and call EnrollmentForm component  
    useEffect(() => {
        setAlertMessage('');
        if (user && !student) {
            fetchStudent();
        }
    }, [user]);


    const renderComponent = () => {
        switch (enrollComponent) {
            case 'DataTableList':
                return <DataTableList setUser={setUser} studentUsers={studentUsers} setReference={setReference} setActiveComponent={setActiveComponent} hideProfile={hideProfile} />;
            case 'EnrollmentForm':
                return <StudentEnrollmentForm studentId={studentId} student={student} batches={batches} programs={programs} semesters={semesters} handleAction={handleAction} handleBack={handleBack} />;
            case 'Dummy':
                return <Dummy />;
            default:
                return <DataTableList setUser={setUser} studentUsers={studentUsers} setReference={setReference} setActiveComponent={setActiveComponent} hideProfile={hideProfile} />;
        }
    }


    return (<>
        <div className="container">

            {alertMessage && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong>{alertMessage}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                </div>
            )}

            {renderComponent()}

        </div>
    </>);
};


const Dummy = () => {
    return (<></>);
}


export default StudentController;