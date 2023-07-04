/**
 * Calling from: ManageAssignPermissions.jsx
 * Calling To: 
 */

import React, { useState, useEffect } from 'react';



const TheAssigneeView = ({ assignee, setAssignPermissionComponent, breadcrumb }) => {
    const [user, setUser] = useState(assignee.user);
    const [profile, setProfile] = useState(assignee.profile);


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
            </div>

        </div>
    );
}



export default TheAssigneeView;