/**
 * Calling From: Activity.jsx
 * Calling To: AddForm-Teacher.jsx; 
 */

import React from 'react';
import AddForm from './AddForm-Teacher';
import API_BASE_URL from '../../utils/config';


const AddTeacher = ({ setActiveComponent }) => {
    const url = `${API_BASE_URL}/teacher/`;
    const formFields = {
        user: {
            username: '',
            password: '',
            email: '',
            first_name: '',
            middle_name: '',
            last_name: '',
        },
        acronym: '',
        gender: '',
        nid: '',
        phone: '',
        birth_date: '',
        father_name: '',
        mother_name: '',
        permanent_address: '',
        present_address: '',
        photo_id: '',
    }

    return (
        <div>
            <a className="icon-link icon-link-hover" href="#" onClick={() => setActiveComponent('main')}>
                <i className="bi bi-arrow-bar-left"></i> Back to activity panel
            </a>

            <h3 className="pb-2 border-bottom">
                <div className="icon-square mt-4 text-beige bg-darkblue d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
                    <i className="bi bi-person-plus-fill"></i>
                </div>
                Add Teacher
            </h3>

            <AddForm formFields={formFields} url={url} />

        </div>
    );
};


export default AddTeacher;

