/**
 * Calling from: ManageAssignPermissions.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getUserRole, getAccessToken } from '../../utils/auth.js';



const TheAssigneeView = ({ assignee, setAssignPermissionComponent, breadcrumb }) => {
    const [user, setUser] = useState(assignee.user);
    const [profile, setProfile] = useState(assignee.profile);
    const [basePermissions, setBasePermissions] = useState(profile.permissions);
    const [baseGroups, setBaseGroups] = useState(profile.permission_groups);
    const [doChangePermissions, setDoChangePermissions] = useState(false);
    const [doChangeGroups, setDoChangeGroups] = useState(false);
    const [contentTypes, setContentTypes] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(basePermissions);
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState(baseGroups);
    const [responseMessage, setResponseMessage] = useState('');
    const accessToken = getAccessToken();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter the basePermissions based on the search query
    const filteredPermissions = basePermissions ? basePermissions.filter(permission =>
        permission.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    console.log(assignee)

    const fetchContentTypes = () => {
        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        axios
            .get(`${API_BASE_URL}/core/custom-content-types/`, config)
            .then(response => {
                setContentTypes(response.data.content_types);
            })
            .catch(error => {
                console.error('Error fetching content types:', error);
            });
    };

    useEffect(() => {
        if (doChangePermissions && contentTypes.length === 0) {
            fetchContentTypes();
        }
    }, [doChangePermissions, contentTypes]);


    const handleContentTypeChange = (e) => {
        const selectedContentTypeId = e.target.value;
        setSelectedContentType(selectedContentTypeId);
        setResponseMessage('');

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                content_type_id: selectedContentTypeId,
            },
        };

        // Fetch permissions for the selected content type
        axios
            .get(`${API_BASE_URL}/core/content-type-permissions/`, config)
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

    const handlePermissionReset = () => {
        setSelectedContentType('');
        setPermissions([]);
        setSelectedPermissions(basePermissions);
        setDoChangePermissions(false);
    }

    const handleUpdatePermissions = (e) => {
        e.preventDefault();

        // Only make the update request if the data has changed
        if (basePermissions.length === selectedPermissions.length &&
            basePermissions.every(permission => selectedPermissions.some(selected => selected.id === permission.id))) {
            setResponseMessage('No changes were made to the group.');
            return;
        }

        // Prepare the data for submission
        const formData = {
            permissions: selectedPermissions.map(permission => permission.id),
        };


        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        const url = `${API_BASE_URL}/${user.role}/update-permissions/${profile.id}/`;

        // Make the API request to update the permission group
        axios.patch(url, formData, config)
            .then(response => {
                setResponseMessage(response.data.message);
                setBasePermissions(selectedPermissions);
                setDoChangePermissions(false);
                setSelectedContentType('');
                setPermissions([]);
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.data && error.response.data.error) {
                    setResponseMessage(error.response.data.error);
                } else {
                    setResponseMessage('An error occurred while updating the permission group.');
                }
            });

    }

    const handleUpdateGroups = () => {

    }


    return (
        <div>
            <a className="icon-link icon-link-hover" href="#" onClick={() => setAssignPermissionComponent('main')}>
                <i className="bi bi-arrow-bar-left"></i> Find another assignee
            </a>

            <h3 className="m-3 text-center"> Assignee View </h3>

            <div className="container d-flex justify-content-center my-2">
                {user.role === 'administrator' ?
                    (
                        <div className="alert bg-darkblue text-beige" role="alert">
                            <i className="bi bi-check2-square fw-bold pt-1"> </i>
                            This is an <strong>administrator</strong> user and has all permissions.
                        </div>
                    ) : (
                        <div>
                            <div className="bg-darkblue p-2 text-beige border-darkblue border d-inline-block m-1">
                                <input className="form-check-input" type="checkbox" id="modifyPermissionsCheckbox" onChange={() => setDoChangePermissions(!doChangePermissions)} checked={doChangePermissions} />
                                <label className="form-check-label px-2" htmlFor="modifyPermissionsCheckbox">
                                    Modify Permissions
                                </label>
                            </div>
                            <div className="bg-darkblue p-2 text-beige border-darkblue border d-inline-block m-1">
                                <input className="form-check-input" type="checkbox" id="modifyGroupsCheckbox" onChange={() => setDoChangeGroups(!doChangeGroups)} checked={doChangeGroups} />
                                <label className="form-check-label px-2" htmlFor="modifyGroupsCheckbox">
                                    Modify Groups
                                </label>
                            </div>
                        </div>
                    )
                }
            </div>

            <div className="mx-md-5 my-5">

                <div className="row mb-3">
                    <label htmlFor="inputUsername" className="col-sm-2 col-form-label">Username</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="inputUsername" readOnly disabled value={user.username} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="inputName" readOnly disabled value={`${user.first_name} ${user.middle_name} ${user.last_name}`} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputRole" className="col-sm-2 col-form-label">Role</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="inputRole" readOnly disabled value={user.role} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputDesignation" className="col-sm-2 col-form-label">Designation</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="inputDesignation" readOnly disabled value={profile.designation} />
                    </div>
                </div>
                {!doChangePermissions && user.role !== 'administrator' && 
                    <div className="row mb-3">
                        <label htmlFor="basePermission" className="col-sm-2 col-form-label">User Permissions:</label>
                        <div className="col-sm-10 bg-white p-2 rounded-1 border">
                            <input className="form-control text-center bg-light border d-block w-100 mb-2" type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search permissions" />
                            {filteredPermissions.map(permission => (
                                <div key={permission.id} id="basePermission" className="bg-beige text-darkblue d-inline-block border rounded-3 p-1 m-1">
                                    <span className="px-2">{permission.codename} - {permission.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>}
            </div>

            {user.role !== 'administrator' &&
                <div className="m-md-5">
                    <form onSubmit={handleUpdatePermissions}>

                        {/* <button type="submit" className="btn btn-primary">Sign in</button> */}

                        {doChangePermissions &&
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
                            </div>}

                        {permissions.length > 0 && (
                            <div class="mb-3 row">
                                <label htmlFor="permissionTypes" class="col-sm-2 col-form-label">Available Permissions:</label>
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

                        {selectedPermissions.length > 0 && doChangePermissions && (
                            <div className="mb-3 row">
                                <label htmlFor="selectedPermission" className="col-sm-2 col-form-label">Selected Permissions:</label>
                                <div className="col-sm-10 bg-white p-2 rounded-1 border">
                                    {selectedPermissions.map(permission => (
                                        <div key={permission.id} id="selectedPermission" className="bg-beige text-darkblue d-inline-block border rounded-3 p-1 m-1">
                                            <span className="px-2">{permission.codename} - {permission.name}</span>
                                            {doChangePermissions &&
                                                <button
                                                    type="button"
                                                    className="btn border-0 border-start p-0 m-0"
                                                    onClick={() => handlePermissionRemove(permission.id)}
                                                >
                                                    <i className="bi bi-x-lg px-2"></i>
                                                </button>}
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

                        {doChangePermissions &&
                            <div className="d-flex m-5">
                                <div className="btn-group mx-auto">
                                    <button type="submit" className="btn btn-darkblue fw-bold me-1" disabled={(selectedPermissions.length === 0)}>Update Permissions</button>
                                    <button type="button" className="btn btn-darkblue" onClick={() => handlePermissionReset()}>Reset</button>
                                </div>
                            </div>}
                    </form>
                </div>
            }

        </div>
    );
}



export default TheAssigneeView;