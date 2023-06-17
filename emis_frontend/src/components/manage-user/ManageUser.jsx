import React from 'react';


const ManageUser = ({ setActiveComponent }) => {
    return (
        <div className="px-4 py-5" id="add-users">
            <h3 className="pb-2 border-bottom">
                <div className="pb-1 icon-square text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-person-gear"></i>
                </div>
                Manage  Users
            </h3>

            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 py-4">
                <div className="col p-2 mx-auto">
                    <button id="manage-admin" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('ManageAdministrator')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-shield-fill-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Manage Admin</h5>
                        </div>
                    </button>
                </div>
                <div className="col p-2 mx-auto">
                    <button id="manage-staff" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('ManageStaff')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-shield-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Manage Staff</h5>
                        </div>
                    </button>
                </div>
                <div className="col p-2 mx-auto">
                    <button id="manage-teacher" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('ManageTeacher')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-person-plus-fill"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Manage Teacher</h5>
                        </div>
                    </button>
                </div>
                <div className="col  p-2 mx-auto">
                    <button id="manage-student" className="d-flex align-items-start bg-darkblue border rounded-3 p-1 w-100" onClick={() => setActiveComponent('ManageStudent')} type='button'>
                        <div className="icon-rounded m-1 text-darkblue bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                            <i className="bi bi-person-plus"></i>
                        </div>
                        <div className="text-beige my-auto w-100 text-end pe-2">
                            <h5 className="">Manage Student</h5>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageUser;