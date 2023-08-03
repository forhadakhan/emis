
/**
 * Calling from: ManageCalendarActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';



const AddAcademicCalendarActivity = ({ date }) => {
    const accessToken = getAccessToken();
    const [responseMsg, setResponseMsg] = useState('');
    const [status, setStatus] = useState('REGULAR');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    // clear form data 
    const clearData = () => {
        setStatus('REGULAR');
        setTitle('');
        setDescription('');
    }


    // send a post/create activity request to backend 
    const handleAddActivity = () => {
        setResponseMsg('');

        // create object to send to api 
        const newActivityData = {
            status: status,
            title: title,
            description: description,
            date: date,
        };

        // make post request to backend api 
        axios.post(`${API_BASE_URL}/calendar/academic-activity/`, newActivityData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // Request success: handle the response from the backend
                setResponseMsg("Activity added successfully.")
                clearData();
            })
            .catch(error => {
                // Request failed: handle any errors
                console.error('Error:', error);
                setResponseMsg("ERROR: Failed to add activity.");
            });
    };


    return (<>
        {/* show error message if any  */}
        {responseMsg && (
            <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <strong> {responseMsg} </strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setResponseMsg('')}></button>
            </div>
        )}


        <div className="d-flex justify-content-center">
            <form action='' className='w-75 w-sm-100 py-5'>

                {/* day status/type  */}
                <div className="row mt-2">
                    <div className="col-md-12">
                        <h6 className='text-secondary fw-normal'>Day Type</h6>
                        <select
                            className="form-select d-block w-100 my-2 rounded-3 p-3 border border-beige"
                            aria-label="Default select example"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="REGULAR">Regular</option>
                            <option value="OFF-DAY">Off-day</option>
                            <option value="WEEKEND">Weekend</option>
                            <option value="SPECIAL">Special</option>
                        </select>
                    </div>
                </div>

                {/* title input field  */}
                <div className="row mt-2">
                    <div className="col-md-12">
                        <h6 className='text-secondary fw-normal'>Title *</h6>
                        <input
                            value={title}
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter the activity title"
                            className='d-block w-100 my-2 rounded-3 p-3 border border-beige'
                        />
                    </div>
                </div>

                {/* description input field  */}
                <div className="row mt-2">
                    <div className="col-md-12">
                        <h6 className='text-secondary fw-normal '>Description</h6>
                        <textarea
                            rows={5}
                            value={description}
                            name='description'
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the activity description (optional)"
                            className='d-block w-100 my-2 rounded-3 p-3 border border-beige'
                        ></textarea>
                    </div>
                </div>

                {/* submit button  */}
                <div className="d-flex justify-content-center py-2 gap-3">
                    {/* submit  */}
                    <button
                        className="btn btn-sm btn-beige border border-darkblue fw-bold px-3"
                        type='button'
                        onClick={handleAddActivity}
                        title="Create new activity for selected day"
                    >
                        <i className="bi bi-calendar-plus pe-2"></i>
                        Save
                    </button>

                    {/* clear form button  */}
                    <button
                        className="btn btn-sm btn-outline-danger rounded-circle p-2 lh-1"
                        type='button'
                        onClick={clearData}
                        title="Clear Form"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

            </form>
        </div>
    </>);
}

export default AddAcademicCalendarActivity;


