/**
* Calling from: TeacherEnrollment.jsx; ManageTeacher.jsx; 
* Calling to: 
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId } from '../../../utils/auth';
import DataTableList from './DataTableList';
import TeacherEnrollmentForm from './TeacherEnrollmentForm.jsx';


const TeacherController = ({ setActiveComponent, setReference, hideProfile }) => {

    const [enrollComponent, setEnrollComponent] = useState('');
    const [user, setUser] = useState('');
    const [teacherUsers, setTeacherUsers] = useState([]);
    const [teacher, setTeacher] = useState('');
    const [teacherId, setTeacherId] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const accessToken = getAccessToken();

    const resetCache = () => {
        setUser('');
        setTeacher('');
        setTeacherId(null);
        setEnrollComponent('');
    }


    const handleBack = async () => {
        setEnrollComponent('DataTableList');
        resetCache();
    };

    const fetchTeacher = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    reference: user,
                },
            };

            const response = await axios.get(`${API_BASE_URL}/teacher/profile/`, config);
            const data = response.data;
            setTeacherId(data.pk);
            setTeacher(data.fields);
            if (data.fields.enrollment) {
                setEnrollComponent("EnrollmentForm");
            } else {
                setEnrollComponent("EnrollmentForm");
            }
        } catch (error) {
            setAlertMessage('An error occurred while fetching the teacher.');
            console.error(error);
        }
    };

    // when an enrollment is changed, re-fetch the teacher and set enrollment form
    const handleAction = async () => {
        setEnrollComponent('Dummy');
        await fetchTeacher(); // wait for fetchTeacher to complete before proceeding
        setTimeout(() => {
            setEnrollComponent('EnrollmentForm');
        }, 100);
    };

    // fetch  users with 'teacher' role for DataTable
    useEffect(() => {
        setAlertMessage('');
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/teacher/users/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setTeacherUsers(response.data);
            } catch (error) {
                setAlertMessage('Error fetching teacher users');
                console.error('Error fetching teacher users:', error);
            }
        };
        fetchUserData();
    }, []);

    // fetch departments for selected at EnrollmentForm
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

                const response = await axios.get(`${API_BASE_URL}/academy/departments/`, config);
                setDepartments(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching available departments list.');
                console.error(error);
            }
        };

        if (departments.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch designations for selected at EnrollmentForm 
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

                const response = await axios.get(`${API_BASE_URL}/academy/designations/`, config);
                setDesignations(response.data);
            } catch (error) {
                setAlertMessage('An error occurred while fetching available designations list.');
                console.error(error);
            }
        };
        if (designations.length === 0) {
            fetchDepartments();
        }

    }, []);

    // fetch teacher data when a user is selected and call EnrollmentForm component  
    useEffect(() => {
        setAlertMessage('');
        if (user && !teacher) {
            fetchTeacher();
        }
    }, [user]);


    const renderComponent = () => {
        switch (enrollComponent) {
            case 'DataTableList':
                return <DataTableList setUser={setUser} teacherUsers={teacherUsers} setReference={setReference} setActiveComponent={setActiveComponent} hideProfile={hideProfile} />;
            case 'EnrollmentForm':
                return <TeacherEnrollmentForm teacherId={teacherId} teacher={teacher} departments={departments} designations={designations} handleAction={handleAction} handleBack={handleBack} />;
            case 'Dummy':
                return <Dummy />;
            default:
                return <DataTableList setUser={setUser} teacherUsers={teacherUsers} setReference={setReference} setActiveComponent={setActiveComponent} hideProfile={hideProfile} />;
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


export default TeacherController;