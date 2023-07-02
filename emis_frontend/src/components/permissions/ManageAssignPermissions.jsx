/**
 * Calling from: UserPermissions.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getUserRole, getAccessToken } from '../../utils/auth.js';


const ManageAssignPermissions = ({ setPermissionComponent, breadcrumb }) => {
    const [assignPermissionComponent, setAssignPermissionComponent] = useState('main');
    const [assignee, setAssignee] = useState({});
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setPermissionComponent('ManageAssignPermissions')}>
            <i className="bi bi-shield-fill-check"></i> Manage Assign Permissions
        </button>
    );

    const renderComponent = () => {
        switch (assignPermissionComponent) {
            case 'main':
                return <FindTheAssignee setAssignPermissionComponent={setAssignPermissionComponent} setAssignee={setAssignee} breadcrumb={updatedBreadcrumb} />;
            case 'TheAssigneeView':
                return <TheAssigneeView setAssignPermissionComponent={setAssignPermissionComponent} assignee={assignee} breadcrumb={updatedBreadcrumb} />;
            case 'FindTheAssignee':
                return <FindTheAssignee setAssignPermissionComponent={setAssignPermissionComponent} setAssignee={setAssignee} breadcrumb={updatedBreadcrumb} />;
            default:
                return (
                    <div className='m-5 text-center'>
                        Looks like the rendering component in
                        <button
                            className="border-1 bg-transparent mx-2"
                            onClick={() => setAssignPermissionComponent('main')}>
                            ManageAssignPermissions
                        </button>
                        is having a wild party and forgot its job description!!
                    </div>
                );
        }
    };

    return (
        <div className="px-4 py-5">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {updatedBreadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>

            <div className="container py-4">
                {renderComponent()}
            </div>
        </div>
    );
};


const FindTheAssignee = ({ setAssignPermissionComponent, setAssignee, breadcrumb }) => {
    
}


const TheAssigneeView = ({ assignee, setAssignPermissionComponent, breadcrumb }) => {

}



export default ManageAssignPermissions;