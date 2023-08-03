
/**
 * Calling from: ManageCalendarActivity.jsx
 * Calling to: 
 */


import React, { useState } from 'react';
import { customDateAndDayName } from '../../utils/utils.js';


const ShowActivities = ({ activities }) => {
    const [responseMsg, setResponseMsg] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for descending, 'asc' for ascending


    // toggle the sorting order
    const toggleSortOrder = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
    };

    // sort the list of activities based on the date and current sorting order
    const sortedActivities = activities.sort((a, b) => {
        if (sortOrder === 'desc') {
            return new Date(b.date) - new Date(a.date);
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });


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
                <div className="d-flex justify-content-between m-2">
                    <div>
                        <h4>Activities</h4>
                    </div>

                    <div>
                        <button type='button' className='btn btn-sm btn-light' onClick={toggleSortOrder}>
                            <i className="bi bi-arrow-down-up pe-2"></i>
                            {sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
                        </button>
                    </div>
                </div>

                {/* show all activities in accordion  */}
                <div className="accordion" id="ActivitiesAccordionPanelsStayOpen">
                    {sortedActivities.map((activity) => (
                        <div className="accordion-item" key={activity.id}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
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
                            <div id={`panelsStayOpen-collapse-${activity.id}`} className="accordion-collapse collapse show">
                                <div className="accordion-body">
                                    <p>{activity.description}</p>
                                    <p className='text-end'><small>{customDateAndDayName(activity.date)}</small></p>
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


