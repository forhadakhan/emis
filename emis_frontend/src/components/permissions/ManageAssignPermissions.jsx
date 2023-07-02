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
    const [username, setUsername] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const accessToken = getAccessToken();

    const handleFindUser = (e) => {
        e.preventDefault();
        setResponseMessage();

        // Prepare the data for submission
        const usernameParam = encodeURIComponent(username);

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const url = `${API_BASE_URL}/get-user/?username=${usernameParam}`;

        // Make the API request to get the user
        axios.get(url, config)
            .then(response => {
                console.log(response);
                setAssignee(response.data);
                setAssignPermissionComponent('TheAssigneeView');
            })
            .catch(error => {
                console.log(error);
                if (error.response && error.response.data && error.response.data.message) {
                    setResponseMessage(error.response.data.message);
                } else {
                    setResponseMessage('An error occurred while retrieving the user.');
                }
            });
    };


    return (
        <div>
            <h1 className="fw-lighter">Manage Assign Permissions</h1>
            <div className="mb-3 my-5 mx-md-5">
                <label htmlFor="usernameInput" className="form-label"><i className="bi bi-input-cursor-text"></i> Enter username</label>
                <input
                    className="form-control border border-darkblue text-center"
                    type="text"
                    placeholder="Enter the assignee username."
                    aria-label="usernameInput"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {responseMessage &&
                <div className="alert alert-warning alert-dismissible fade show border border-darkblue mx-md-5" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <strong> {responseMessage} </strong>
                    <button type="button" onClick={() => setResponseMessage('')} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}

            <div className="mb-3 m-3 d-flex">
                <button className="btn btn-darkblue mx-auto" onClick={handleFindUser} disabled={username.length < 1} type='button'>
                    <i className="bi bi-search"></i> Find
                </button>
            </div>
        </div>
    );
}


const TheAssigneeView = ({ assignee, setAssignPermissionComponent, breadcrumb }) => {

    const [user, setUser] = useState(assignee.user);
    const [profile, setProfile] = useState(assignee.profile);


    return (
        <div>
            <h1 className="fw-lighter">Assignee View</h1>

            <form className="m-5"> 
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
                
                {/* <button type="submit" className="btn btn-primary">Sign in</button> */}
            </form>

        </div>
    );
}



export default ManageAssignPermissions;