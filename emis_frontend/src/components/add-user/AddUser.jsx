import React from 'react';
import {getUserRole} from '../../utils/auth.js'; 

const AddUser = ({ setActiveComponent, filterComponents }) => {
    const user_role = getUserRole();
    return (
        <div className="px-4 py-5" id="add-users">
            <h3 className="pb-2 border-bottom">
                <div className="pb-1 icon-square text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-plus-square-dotted"></i>
                </div>
                Add Users
            </h3>

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 py-4">
                {user_role === "administrator" && filterComponents('Add Admin') && (
                <div className="col p-2 mx-auto">
                    <button id="add-admin" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('AddAdministrator')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-shield-fill-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Add Admin</h5>
                        </div>
                    </button>
                </div>)}
                {user_role === "administrator" &&
                <div className="col p-2 mx-auto">
                    <button id="add-staff" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('AddStaff')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-shield-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Add Staff</h5>
                        </div>
                    </button>
                </div>}
                {(user_role === "administrator" || user_role === "staff") && 
                <div className="col p-2 mx-auto">
                    <button id="add-teacher" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('AddTeacher')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-person-plus-fill"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Add Teacher</h5>
                        </div>
                    </button>
                </div>}
                {(user_role === "administrator" || user_role === "staff") && 
                <div className="col  p-2 mx-auto">
                    <button id="add-student" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('AddStudent')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-person-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Add Student</h5>
                        </div>
                    </button>
                </div>}
            </div>
        </div>
    );
};


export default AddUser;
