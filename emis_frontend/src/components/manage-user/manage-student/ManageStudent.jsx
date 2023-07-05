/**
 * Calling From: Activity.jsx 
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId } from '../../../utils/auth';
import DataTableList from './DataTableList';


const ManageStudent = ({ setActiveComponent, setReference, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [students, setStudents] = useState([]);

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageStudent')}>
            <i className="bi bi-person-gear"></i> Manage Students
        </button>
    );

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/student/users/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);


    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {updatedBreadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>

            {/* <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('main')}>
                <i className="bi bi-arrow-bar-left"></i> Back to activity panel
            </a> */}

            <h3 className="pb-2 border-bottom">
                <div className="icon-square mt-4 text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-person-gear"></i>
                </div>
                Manage Students
            </h3>

            <DataTableList source={students} setReference={setReference} setActiveComponent={setActiveComponent} />

        </div>
    );
};



export default ManageStudent;
