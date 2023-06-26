/**
 * Parent: Activity.jsx 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../utils/config';
import { getAccessToken, getUserId } from '../../../utils/auth';
import DataTableList from './DataTableList-Administrator&Staff';


const ManageStaff = ({ setActiveComponent, setReference,  setUserType  }) => {
    const [staffs, setStaffs] = useState([]);
    const accessToken = getAccessToken();
    setUserType('staff');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/staff/users`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStaffs(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('main')}>
                <i className="bi bi-arrow-bar-left"></i> Back to activity panel
            </a>

            <h3 className="pb-2 border-bottom">
                <div className="icon-square mt-4 text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-shield-fill-plus"></i>
                </div>
                Manage Staff 
            </h3>
 
            <DataTableList source={staffs} setReference={setReference} setActiveComponent={setActiveComponent}/>
            
        </div>
    );
};


export default ManageStaff;

