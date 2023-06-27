/**
 * Calling from: UserPermissions.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';
import { getUserRole } from '../../utils/auth.js';


const AssignPermissions = ({ setPermissionComponent, breadcrumb }) => {
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setPermissionComponent('AssignPermissions')}>
            <i className="bi bi-shield-fill-check"></i> Assign Permissions
        </button>
    );

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
                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <button type="button" class="btn btn-dark">
                        <i className="bi bi-plus text-start me-2"></i>
                        <span className="text-center">Assign Permission</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignPermissions;