import React, { useState, useEffect } from 'react';
import { getUserRole } from '../../utils/auth.js';
import ManageGroup from './ManageGroup.jsx';
import AssignPermissions from './AssignPermissions.jsx';

const UserPermissions = ({ setActiveComponent, breadcrumb }) => {
    const [permissionComponent, setPermissionComponent] = useState('main');
    const user_role = getUserRole();

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setPermissionComponent('main')}>
            <i className="bi bi-shield-shaded"></i> User Permissions
        </button>
    );

    const renderComponent = () => {
        switch (permissionComponent) {
            case 'main':
                return <PermissionPanel setPermissionComponent={setPermissionComponent} breadcrumb={updatedBreadcrumb} setActiveComponent={setActiveComponent} />;
            case 'ManageGroup':
                return <ManageGroup setPermissionComponent={setPermissionComponent} breadcrumb={updatedBreadcrumb} />;
            case 'AssignPermissions':
                return <AssignPermissions setPermissionComponent={setPermissionComponent} breadcrumb={updatedBreadcrumb} />;
            default:
                return (
                    <div className='m-5 text-center'>
                        Looks like the rendering component in
                        <button
                            className="border-1 bg-transparent mx-2"
                            onClick={() => setPermissionComponent('main')}>
                            UserPermissions
                        </button>
                        is having a wild party and forgot its job description!!
                    </div>
                );
        }
    };


    return (
        <div>
            <div className="container">

                {/* Render permissionComponent */}
                {renderComponent()}
            </div>
        </div>
    );
};


const PermissionPanel = ({ setPermissionComponent, breadcrumb }) => {
    const user_role = getUserRole();
    const [searchTerm, setSearchTerm] = useState('');

    const elements = [
        { id: 'manage_group', label: 'Manage Group', render: 'ManageGroup', icon: 'bi-people-fill' },
        { id: 'assign_permissions', label: 'Assign Permissions', render: 'AssignPermissions', icon: 'bi-shield-fill-check' },
    ];

    let allowedElements = [];

    if (user_role === "administrator") {
        allowedElements = [...elements];
    }

    return (
        <div className="px-4 py-5" id="permissions">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    {breadcrumb.map((item, index) => (
                        <li className="breadcrumb-item" key={index}>{item}</li>
                    ))}
                </ol>
            </nav>
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 py-4">
                {/* Render the filtered elements */}
                {allowedElements.map(element => (
                    <div className="col p-2 mx-auto" key={element.id}>
                        <button
                            id={element.id}
                            className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100"
                            onClick={() => setPermissionComponent(element.render)}
                            type='button'
                        >
                            <div className="text-beige my-auto w-100 text-center p-2">
                                <i className={`bi ${element.icon} text-start`}></i>  
                                <span className='text-end'> {element.label} </span>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};





export default UserPermissions;