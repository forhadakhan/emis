/**
 * Calling from: ManageGroup.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


function CreatePermissionGroup() {
    const [contentTypes, setContentTypes] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const fetchContentTypes = () => {
        axios
            .get(`${API_BASE_URL}/core/custom-content-types/`)
            .then(response => {
                setContentTypes(response.data.content_types);
            })
            .catch(error => {
                console.error('Error fetching content types:', error);
            });
    };

    useEffect(() => {
        fetchContentTypes();
    }, []);


    const handleContentTypeChange = (e) => {
        const selectedContentTypeId = e.target.value;
        setSelectedContentType(selectedContentTypeId);
        setResponseMessage('');

        // Fetch permissions for the selected content type
        axios.get(`${API_BASE_URL}/core/content-type-permissions/`, {
            params: {
                content_type_id: selectedContentTypeId,
            },
        })
            .then(response => {
                setPermissions(response.data.permissions);
            })
            .catch(error => {
                console.error('Error fetching permissions:', error);
            });
    };

    const handlePermissionChange = (e) => {
        const permissionId = e.target.value;
        const selectedPermission = permissions.find(permission => permission.id === parseInt(permissionId));

        // Add the selected permission to the list of selected permissions
        setSelectedPermissions(prevPermissions => {
            const alreadySelected = prevPermissions.find(permission => permission.id === selectedPermission.id);
            if (!alreadySelected) {
                return [...prevPermissions, selectedPermission];
            }
            return prevPermissions;
        });
    };

    const handlePermissionRemove = (permissionId) => {
        setSelectedPermissions(prevPermissions => (
            prevPermissions.filter(permission => permission.id !== permissionId)
        ));
    };

    const handlePermissionClear = () => {
        setSelectedContentType('');
        setPermissions([]);
        setSelectedPermissions([]);
        setGroupName('');
    }

    const handleGroupSubmit = (e) => {
        e.preventDefault();

        // Prepare the data for submission
        const formData = {
            group_name: groupName,
            permissions: selectedPermissions.map(permission => permission.id),
        };

        // Configure the request headers
        const accessToken = getAccessToken();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        // Make the API request to create the permission group
        axios.post(`${API_BASE_URL}/core/permission-group-create/`, formData, config)
            .then(response => {
                console.log(response);
                setResponseMessage(response.data.message);
                handlePermissionClear();
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.data && error.response.data.error) {
                    setResponseMessage(error.response.data.error);
                } else {
                    setResponseMessage('An error occurred while creating the permission group.');
                }
            });
    };


    return (
        <div className="m-5">
            <h1 className="mb-4">Create Permission Group</h1>
            <form onSubmit={handleGroupSubmit}>
                <div class="mb-3 row">
                    <label htmlFor="groupName" class="col-sm-2 col-form-label">Group Name:</label>
                    <div class="col-sm-10">
                        <input type="text" id="groupName" value={groupName} onChange={e => setGroupName(e.target.value)} class="form-control" required />
                    </div>
                </div>

                <div class="mb-3 row">
                    <label htmlFor="contentTypes" class="col-sm-2 col-form-label">Content Type:</label>
                    <div class="col-sm-10">
                        <select value={selectedContentType} onChange={handleContentTypeChange} id="contentTypes" class="form-select" aria-label="Content Type">
                            <option value="">Select a content type</option>
                            {contentTypes.map(contentType => (
                                <option key={contentType.id} value={contentType.id}>
                                    {contentType.app_label} - {contentType.model}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {permissions.length > 0 && (
                    <div class="mb-3 row">
                        <label htmlFor="permissionTypes" class="col-sm-2 col-form-label">Permissions:</label>
                        <div class="col-sm-10">
                            <select multiple onChange={handlePermissionChange} id='permissionTypes' class="form-select" aria-label="Permission Types">
                                {permissions.map(permission => (
                                    <option key={permission.id} value={permission.id}>
                                        {permission.codename} - {permission.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {selectedPermissions.length > 0 && (
                    <div className="mb-3 row">
                        <label htmlFor="selectedPermission" className="col-sm-2 col-form-label">Selected Permissions:</label>
                        <div className="col-sm-10 bg-white p-2 rounded-1 border">
                            {selectedPermissions.map(permission => (
                                <div key={permission.id} id="selectedPermission" className="bg-beige text-darkblue d-inline-block border rounded-5 m-1">
                                    <span className="px-2">{permission.codename} - {permission.name}</span>
                                    <button
                                        type="button"
                                        className="btn border-0 border-start p-0 m-0"
                                        onClick={() => handlePermissionRemove(permission.id)}
                                    >
                                        <i className="bi bi-x-lg px-2"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {responseMessage && (
                    <div className="alert alert-info alert-dismissible fade show" role="alert">
                        <strong>{responseMessage}</strong>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={() => setResponseMessage('')}
                        ></button>

                    </div>)}


                <div className="d-flex m-5">
                    <div className="btn-group mx-auto">
                        <button type="submit" className="btn btn-darkblue fw-bold me-1" disabled={(selectedPermissions.length === 0 || groupName === '')}>Create Group</button>
                        <button type="button" className="btn btn-darkblue" onClick={() => handlePermissionClear()}>Clear</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreatePermissionGroup;
