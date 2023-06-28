/**
 * Calling from: UserPermissions.jsx
 * Calling To: CreatePermissionGroup.jsx;
 */

import React, { useState, useEffect } from 'react';
import { getUserRole } from '../../utils/auth.js';
import CreatePermissionGroup from './CreatePermissionGroup.jsx';
import ViewGroups from './ViewGroups.jsx';

const ManageGroup = ({ setPermissionComponent, breadcrumb }) => {
    const [getComponent, setGetComponent] = useState('');
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setPermissionComponent('ManageGroup')}>
            <i className="bi bi-people-fill"></i> Manage Group
        </button>
    );

    const renderComponent = () => {
        switch (getComponent) {
            case 'CreatePermissionGroup':
                return <CreatePermissionGroup setGetComponent={setPermissionComponent} />;
            case 'PermissionGroupList':
                return <ViewGroups setGetComponent={setPermissionComponent} />;
            default:
                return (
                    <div className='m-5 text-center m-5 p-5'>
                        Please select an option from above buttons. 
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

            <div className="container py-4 d-flex justify-content-center">

                <div className="btn-group m-1" role="group" onClick={() => setGetComponent('CreatePermissionGroup')}>
                    <button type="button" className="btn btn-darkblue" disabled={getComponent==='CreatePermissionGroup'}>
                        <i className="bi bi-plus text-start me-2"></i>
                        <span className="text-center">Create Group </span>
                    </button>
                </div>

                <div className="btn-group m-1" role="group" onClick={() => setGetComponent('PermissionGroupList')}>
                    <button type="button" className="btn btn-darkblue" disabled={getComponent==='PermissionGroupList'}>
                        <i className="bi bi-eye-fill text-start me-2"></i>
                        <span className="text-center">View Groups</span>
                    </button>
                </div>

            </div>

            <div>
                {renderComponent()}
            </div>
        </div>
    );
};

export default ManageGroup;