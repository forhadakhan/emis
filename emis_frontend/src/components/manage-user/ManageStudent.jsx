import React from 'react';


const ManageStudent = ({ setActiveComponent }) => {
    return (
        <div>
            <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('main')}>
                <i className="bi bi-arrow-bar-left"></i> Back to activity panel
            </a>

            <h3 className="pb-2 border-bottom">
                <div className="icon-square mt-4 text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-person-plus"></i>
                </div>
                Manage Student
            </h3>

        </div>
    );
};



export default ManageStudent;
