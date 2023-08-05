
/**
 * Calling from: ManageCalendarActivity.jsx
 * Calling to: 
 */


import React, { useState } from 'react';
import { hasPermission } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';


const ShowActivities = ({ activities }) => {
    const [responseMsg, setResponseMsg] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'desc' for descending, 'asc' for ascending
    const [isDelete, setIsDelete] = useState(false);


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
                                                <button className='btn btn-sm btn-outline-danger border border-0 mx-1 p-0 px-1' onClick={() => { setIsDelete(!isDelete) }}>delete</button>
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

        </div>
    </>);
}

export default ShowActivities;


