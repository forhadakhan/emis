
/**
 * Calling from: ManageCalendarActivity.jsx
 * Calling to: 
 */


import axios from 'axios';
import React, { useState } from 'react';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken, hasPermission } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';


const ShowActivities = ({ activities }) => {
    const [responseMsg, setResponseMsg] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'desc' for descending, 'asc' for ascending
    const [isDelete, setIsDelete] = useState(false);
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


    const handleDelete = (activity) => {
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
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#panelsStayOpen-collapse-${activity.id}`}
                                    aria-expanded="true"
                                    aria-controls={`panelsStayOpen-collapse-${activity.id}`}
                                >
                                    <strong>{activity.title}</strong>
                                    <span className='badge p-1 bg-beige text-dark ms-2'>{activity.date}</span>
                                    {activity.status && <span className='badge p-1 bg-dark text-light mx-2'>{activity.status}</span>}
                                </button>
                            </h2>
                            <div id={`panelsStayOpen-collapse-${activity.id}`} className="accordion-collapse collapse">
                                <div className="accordion-body">
                                    <p>{activity.description}</p>

                                    <p className='d-flex justify-content-between mb-0'>
                                        <span>
                                            {hasPermission('change_defaultcalendaractivity') && <>
                                                <button className='btn btn-sm btn-outline-primary border border-0 mx-1 p-0 px-1'>edit</button>
                                                <button className='btn btn-sm btn-outline-danger border border-0 mx-1 p-0 px-1' onClick={() => { handleDelete(activity) }}>delete</button>
                                            </>}
                                        </span>
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

            {isDelete && <>
                <DeleteTermModal
                    show={isDelete}
                    handleClose={() => { setIsDelete(false) }}
                    activity={selectedActivity}
                />
            </>}
        </div>
    </>);
}



const DeleteTermModal = ({ show, handleClose, activity }) => {
    const [deleteMessage, setDeleteMessage] = useState('');
    const [deleted, setDeleted] = useState(false);
    const accessToken = getAccessToken();

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

        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-md-down" role="document">
                    <div className="modal-content border border-beige">
                        <div className="modal-header bg-danger text-beige">
                            <h5 className="modal-title fs-4">
                                <i className="bi bi-trash"></i>
                                <span className='text-light'>Delete Activity/Event</span>
                            </h5>
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body text-center bg-light">

                            <h5 className='my-4'>{activity.title}</h5>
                            <strong className='p-1 bg-beige text-darkblue ms-2'>{activity.date}</strong>
                            {activity.status && <span className='p-1 bg-dark text-light mx-2'>{activity.status}</span>}


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


