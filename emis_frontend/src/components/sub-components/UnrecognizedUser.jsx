/**
* Calling from: ActivityController.jsx
* Calling to: 
*/

import React from 'react';

const UnrecognizedUser = () => {
    return (
        <div>

            <div className="px-4 py-5 my-5 text-center">
                <div className="rounded m-1 text-warning bg-darkblue px-4 py-3 pb-4 d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                <i className="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h1 className="display-5 py-5 fw-bold text-body-emphasis">System cannot recognize you :( </h1>
                <div className="col-lg-6 mx-auto">
                    <small className="mb-4">To resolve this issue, please try sign out and sign in again. If not solved, contact an administrator.</small>
                </div>
            </div>
        </div>
    );
};

export default UnrecognizedUser;
