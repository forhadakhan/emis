
/**
 * Calling from: ManageCalendarActivity.jsx
 * Calling to: 
 */


import axios from 'axios';
import React, { useState } from 'react';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, hasPermission } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';


// Main component 
const ShowActivities = ({ activities }) => {
    const [responseMsg, setResponseMsg] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'desc' for descending, 'asc' for ascending
    const [isDelete, setIsDelete] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState({});


    // toggle the sorting order
    const toggleSortOrder = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    };


    // sort the list of activities based on the date and current sorting order 
    // sort only if there are multiple elements in the activities array
    const sortedActivities = (activities.length > 1)
        ? activities.sort((a, b) => {
            if (sortOrder === 'desc') {
                return new Date(b.date) - new Date(a.date);
            } else {
                return new Date(a.date) - new Date(b.date);
            }
        })
        : activities;


    // handle edit request/click 
    const handleEditClick = (activity) => {
        setSelectedActivity(activity);
        setIsEdit(!isEdit);
    }


    // handle delete request/click 
    const handleDeleteClick = (activity) => {
        setSelectedActivity(activity);
        setIsDelete(!isDelete);
    }


    return (<>
        {/* show error message if any  */}
        {responseMsg && (
            <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <strong> {responseMsg} </strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setResponseMsg('')}></button>
            </div>
        )}


        {/* in case there are no activities, let the viewer know  */}
        {(sortedActivities.length < 1) && <>
            <p className="text-center">
                No activity found.
            </p>
        </>}

        {/* if there activities, list them all  */}
        {(sortedActivities.length > 0) && <>
            <div>
                {/* heading and sort button  */}
                <div className="d-flex justify-content-between m-1">
                    <div>
                        <h5 className='text-secondary'>
                            <i className="bi bi-calendar2-check pe-2"></i>
                            Activities
                        </h5>
                    </div>

                    <div>
                        {/* sort button  */}
                        <button
                            type='button'
                            className='btn btn-sm btn-light'
                            onClick={toggleSortOrder}
                            title={sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
                        >
                            {/* sort icon  */}
                            <i className="bi bi-arrow-down-up"></i>
                        </button>
                    </div>
                </div>

                {/* show all activities in accordion  */}
                <div className="accordion" id="ActivitiesAccordionPanels">
                    {sortedActivities.map((activity) => (
                        <div className="accordion-item" key={activity.id}>
                            <h2 className="accordion-header">
                                {/* show activit title, date, status  */}
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#panelsStayOpen-collapse-${activity.id}`}
                                    aria-expanded="true"
                                    aria-controls={`panelsStayOpen-collapse-${activity.id}`}
                                >
                                    <strong>{activity.title}</strong>
                                    <span className='badge p-1 bg-beige text-darkblue ms-2'>{activity.date}</span>
                                    {activity.status && <span className='badge p-1 bg-dark text-light mx-2'>{activity.status}</span>}
                                </button>
                            </h2>

                            <div id={`panelsStayOpen-collapse-${activity.id}`} className="accordion-collapse collapse">
                                <div className="accordion-body">

                                    {/* show activity description  */}
                                    <p>{activity.description}</p>

                                    <p className='d-flex justify-content-between mb-0'>
                                        <span>
                                            {/* if the user is authorized, show edit and delete button  */}
                                            {hasPermission('change_defaultcalendaractivity') && <>
                                                <button className='btn btn-sm btn-outline-primary border border-0 mx-1 p-0 px-1' onClick={() => { handleEditClick(activity) }}>edit</button>
                                                <button className='btn btn-sm btn-outline-danger border border-0 mx-1 p-0 px-1' onClick={() => { handleDeleteClick(activity) }}>delete</button>
                                            </>}
                                        </span>
                                        {/* show date  */}
                                        <span><small>{customDateAndDayName(activity.date)}</small></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>}

        <div className="">

            {/* if user request delete, show delete modal  */}
            {isEdit && <>
                <EditModal
                    show={isEdit}
                    handleClose={() => { setIsEdit(false) }}
                    activity={selectedActivity}
                />
            </>}

            {/* if user request delete, show delete modal  */}
            {isDelete && <>
                <DeleteModal
                    show={isDelete}
                    handleClose={() => { setIsDelete(false) }}
                    activity={selectedActivity}
                />
            </>}
        </div>
    </>);
}



// Sub-component to ShowActivities  
const EditModal = ({ show, handleClose, activity }) => {
    const accessToken = getAccessToken();
    const [status, setStatus] = useState(activity.status);
    const [title, setTitle] = useState(activity.title);
    const [description, setDescription] = useState(activity.description);
    const [updateMessage, setUpdateMessage] = useState('');


    // send a put/update activity request to backend 
    const handleUpdate = () => {
        setUpdateMessage('');

        // create object to send to api 
        const updateData = {
            status: status,
            title: title,
            description: description,
            date: activity.date,
        };

        // make a put request to backend api 
        axios.put(`${API_BASE_URL}/calendar/academic-activity/${activity.id}/`, updateData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                // Request success: handle the response from the backend
                setUpdateMessage("Activity/event updated successfully.");
            })
            .catch(error => {
                // Request failed: handle any errors
                console.error('Error:', error);
                setUpdateMessage("ERROR: Failed to update activity/event.");
            });
    };


    return (<>
        {/* edit modal  */}
        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered modal-fullscreen-md-down modal-lg" role="document">
                    <div className="modal-content border border-beige">

                        {/* modal title  */}
                        <div className="modal-header bg-darkblue text-beige">
                            <h5 className="modal-title fs-4"><i className="bi bi-pen"></i> Edit activity/event </h5>
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* modal body  */}
                        <div className="modal-body">
                            <div className="d-flex justify-content-center">
                                <form action='' className='w-100'>

                                    {/* title input field  */}
                                    <div className="row mt-2">
                                        <div className="col-md-12">
                                            <h6 className='text-secondary fw-normal'>Title *</h6>
                                            <input
                                                value={title}
                                                required
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter the activity title"
                                                className='d-block w-100 my-2 fw-bold rounded-3 p-3 border border-beige'
                                            />
                                        </div>
                                    </div>

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

                                    {/* update button  */}
                                    <div className="d-flex justify-content-center py-2 gap-3">
                                        <button
                                            className="btn btn-sm btn-beige border border-darkblue fw-bold px-3"
                                            type='button'
                                            onClick={handleUpdate}
                                            title="Create new activity for selected day"
                                        >
                                            <i className="bi bi-calendar-plus pe-2"></i>
                                            Update
                                        </button>
                                    </div>

                                </form>
                            </div>
                            {/* display update message upon request  */}
                            {updateMessage && <div className='p-3 text-center'>{updateMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};


// Sub-component to ShowActivities  
const DeleteModal = ({ show, handleClose, activity }) => {
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleted, setDeleted] = useState(false);
    const accessToken = getAccessToken();

    // delete activity/event from db through backend api 
    const handleDelete = async (e) => {
        e.preventDefault();
        setDeleteMessage('');

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.delete(
                `${API_BASE_URL}/calendar/academic-activity/${activity.id}/`,
                config
            );

            setDeleted(true);
        } catch (error) {
            setDeleteMessage('Deletion failed, an error occurred.');
            console.error(error);
        }
    };

    return (<>
        {/* delete modal  */}
        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-md-down" role="document">
                    <div className="modal-content border border-beige">
                        <div className="modal-header bg-danger text-beige">

                            {/* show modal title  */}
                            <h5 className="modal-title fs-4">
                                <i className="bi bi-trash"></i>
                                <span className='text-light'>Delete Activity/Event</span>
                            </h5>
                            {/* show modal close button  */}
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* modal body  */}
                        <div className="modal-body text-center bg-light">

                            {/* activity title, date, status  */}
                            <h5 className='my-4'>{activity.title}</h5>
                            <strong className='p-1 bg-beige text-darkblue ms-2'>{activity.date}</strong>
                            {activity.status && <span className='p-1 bg-dark text-light mx-2'>{activity.status}</span>}

                            {/* delete button and related messages  */}
                            <form onSubmit={handleDelete}>
                                <div className="m-3 fw-bold">
                                    {deleted ?
                                        `Deleted Successfully` :
                                        `Are you sure to delete?`
                                    }
                                </div>
                                {!deleted &&
                                    <div className="btn-group">
                                        <button type="submit" className="btn btn-danger fw-medium m-1">Delete</button>
                                        <button type="button" className="btn btn-secondary fw-medium m-1" onClick={handleClose} data-dismiss="modal" aria-label="Close">Cancel</button>
                                    </div>}
                            </form>
                            {deleteMessage && <div className='p-3'>{deleteMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};



export default ShowActivities;


