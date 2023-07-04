/**
 * Calling from: ManageGroup.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';

const ViewGroups = ({ setGetComponent }) => {
    const [groupComponent, setGroupComponent] = useState('PermissionGroupList');
    const [group, setGroup] = useState(null);

    const renderGroupComponent = () => {
        switch (groupComponent) {
            case 'PermissionGroupList':
                return <PermissionGroupList setGroupComponent={setGroupComponent} setGroup={setGroup} />;
            case 'GroupRemote':
                return <GroupRemote setGroupComponent={setGroupComponent} baseGroup={group} />;
            default:
                return <PermissionGroupList setGroupComponent={setGroupComponent} setGroup={setGroup} />;
        }
    };

    return (
        <div>
            {renderGroupComponent()}
        </div>
    );
}



const PermissionGroupList = ({ setGroupComponent, setGroup }) => {
    const [permissionGroups, setPermissionGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const accessToken = getAccessToken();

    useEffect(() => {
        fetchPermissionGroups();
    }, []);

    useEffect(() => {
        setFilteredGroups(permissionGroups);
    }, [permissionGroups]);

    const fetchPermissionGroups = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/core/permission-group-list/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            setPermissionGroups(response.data);
        } catch (error) {
            setErrorMessage('Error fetching permission groups');
            console.error('Error fetching permission groups:', error);
        }
    };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = permissionGroups.filter((group) =>
            group.name.toLowerCase().includes(keyword)
        );
        setFilteredGroups(filteredResults);
    };

    const columns = [
        {
            name: 'Group Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Total Permissions',
            selector: (group) => group.permissions.length,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-beige text-darkblue p-0 px-1"
                    onClick={() => handleGroupClick(row)}
                >
                    <i className="bi bi-window-dock"></i> Details
                </button>
            ),
            button: true,
        },
    ];

    const handleGroupClick = (group) => {
        setGroup(group);
        setGroupComponent('GroupRemote');
    };

    const customStyles = {
        rows: {
            style: {
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontWeight: 'bold'
            },
        },
    };

    return (
        <div className="m-5">
            <h1 className="mb-4">Permission Groups</h1>

            {errorMessage && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <strong> {errorMessage} </strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setErrorMessage('')}
                    ></button>
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <div className="bg-white p-1 rounded-3 border">
                <DataTable
                    columns={columns}
                    data={filteredGroups}
                    customStyles={customStyles}
                    pagination
                />
            </div>
        </div>
    );
};

 
const GroupRemote = ({ setGroupComponent, baseGroup }) => {
    const [baseGroupName, setBaseGroupName] = useState(baseGroup.name);
    const [baseGroupPermissions, setBaseGroupPermissions] = useState(baseGroup.permissions);
    const [doChange, setDoChange] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [contentTypes, setContentTypes] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(baseGroupPermissions);
    const [groupName, setGroupName] = useState(baseGroupName);
    const [searchQuery, setSearchQuery] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const accessToken = getAccessToken();


    const filteredPermissions = selectedPermissions ? selectedPermissions.filter(permission =>
        permission.codename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];


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
        if (doChange && contentTypes.length === 0) {
            fetchContentTypes();
        }
    }, [doChange, contentTypes]);


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

    const handlePermissionReset = () => {
        setSelectedContentType('');
        setPermissions([]);
        setSelectedPermissions(baseGroupPermissions);
        setGroupName(baseGroupName);
        setDoChange(false);
    }

    const handleDelete = () => {
        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        axios
            .delete(`${API_BASE_URL}/core/permission-group-delete/${baseGroup.id}/`, config)
            .then(response => {
                console.log(response);
                setGroupComponent('PermissionGroupList');
            })
            .catch(error => {
                console.error('Error deleting permission group:', error);
                // Handle error if required
            });
    };

    const handleGroupUpdate = (e) => {
        e.preventDefault();

        // Only make the update request if the data has changed
        if (baseGroupName === groupName && baseGroupPermissions.length === selectedPermissions.length &&
            baseGroupPermissions.every(permission => selectedPermissions.some(selected => selected.id === permission.id))) {
            setResponseMessage('No changes were made to the group.');
            return;
        }

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

        // Make the API request to update the permission group
        axios.put(`${API_BASE_URL}/core/permission-group-update/${baseGroup.id}/`, formData, config)
            .then(response => {
                setResponseMessage(response.data.message);
                setBaseGroupName(groupName);
                setBaseGroupPermissions(selectedPermissions);
                setDoChange(false);
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
    };




    return (
        <div>
            <a className="icon-link icon-link-hover" href="#" onClick={() => setGroupComponent('PermissionGroupList')}>
                <i className="bi bi-arrow-bar-left"></i> All Permission Groups
            </a>

            <h3 className="m-3 text-center"> Group Details </h3>

            <div class="container d-flex justify-content-center my-2">
                <div class="bg-beige p-2 text-darkblue border-darkblue border">
                    <input class="form-check-input" type="checkbox" id="modifyCheckbox" onChange={() => setDoChange(!doChange)} checked={doChange} />
                    <label class="form-check-label px-2" htmlFor="modifyCheckbox">
                        Modify Group
                    </label>
                </div>

                <div class="">
                    <button class="mx-1 bg-beige p-2 text-darkblue border-darkblue border" type="checkbox" id="modifyCheckbox" onClick={() => setIsDelete(!isDelete)} >
                        Delete Group
                    </button>
                </div>
            </div>
            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this group?</h6>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                            <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(false)}> No </button>
                        </div>
                    </div>
                </div>}

            <div className="m-5">
                <form onSubmit={handleGroupUpdate}>
                    <div class="mb-3 row">
                        <label htmlFor="groupName" class="col-sm-2 col-form-label">Group Name:</label>
                        <div class="col-sm-10">
                            <input type="text" id="groupName" value={groupName} onChange={e => setGroupName(e.target.value)} class="form-control fw-bold" disabled={!doChange} required />
                        </div>
                    </div>

                    {doChange &&
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

                    {selectedPermissions.length > 0 && (
                        <div className="mb-3 row">
                            <label htmlFor="selectedPermission" className="col-sm-2 col-form-label">Group Permissions:</label>
                            <div className="col-sm-10 bg-white p-2 rounded-1 border">
                                <input className="form-control text-center bg-light border d-block w-100 mb-2" type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search permissions" />
                                {filteredPermissions.map(permission => (
                                    <div key={permission.id} id="selectedPermission" className="bg-beige text-darkblue d-inline-block border rounded-3 p-1 m-1">
                                        <span className="px-2">{permission.codename} - {permission.name}</span>
                                        {doChange &&
                                            <button type="button" className="btn border-0 border-start p-0 m-0" onClick={() => handlePermissionRemove(permission.id)}>
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

                    {doChange &&
                        <div className="d-flex m-5">
                            <div className="btn-group mx-auto">
                                <button type="submit" className="btn btn-darkblue fw-bold me-1" disabled={(selectedPermissions.length === 0 || groupName === '')}>Update Group</button>
                                <button type="button" className="btn btn-darkblue" onClick={() => handlePermissionReset()}>Reset</button>
                            </div>
                        </div>}
                </form>
            </div>
        </div>
    );
}


export default ViewGroups;
