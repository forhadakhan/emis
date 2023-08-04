/**
 * Calling from: ManageAcademicCalendar.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';

import AddAcademicCalendarActivity from './AddAcademicCalendarActivity.jsx';
import ShowActivities from './ShowActivities.jsx';



const ManageCalendarActivity = ({ }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [activities, setActivities] = useState([]);
    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const [showComponent, setShowComponent] = useState('');


    const fetchActivities = async (date) => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/calendar/academic-activity/?date=${date}`, config);
            setActivities(response.data);
            setError('');
        } catch (error) {
            setError(' Failed to fetch activities.');
            console.error('Error fetching activities:', error);
        }
    };
    useEffect(() => {
        if (date) {
            fetchActivities(date);
        }
    }, [date])

    useEffect(() => {
        if (activities.length > 0) {
            setShowComponent('ShowActivities');
        }
    }, [activities])


    // render selected component 
    const renderComponent = () => {
        switch (showComponent) {
            case 'ShowActivities':
                return <ShowActivities activities={activities} />;
            default:
                return '';
        }
    }


    return (
        <>
            {/* show error message if any  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')} ></button>
                </div>
            )}


            {/* Activity Tab Info */}
            <div>
                <p className="">
                    <a
                        className="btn btn-light"
                        data-bs-toggle="collapse"
                        href="#collapseActivityTabInfo"
                        role="button"
                        aria-expanded="false"
                        aria-controls="collapseActivityTabInfo"
                    >
                        <i className='bi bi-info-circle'></i>
                    </a>
                </p>
                <div className="collapse mb-5" id="collapseActivityTabInfo">
                    <div className="card card-body">
                        <p className="text-center mt-2 lead">
                            Pick a date to manage academic calendar activity for a that day.
                        </p>
                    </div>
                </div>
            </div>


            {/* input: pick a date  */}
            <div className="d-flex justify-content-center">
                <div className="mb-3 w-25 w-sm-100">
                    <label className="form-label h6">Pick a Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={date}
                        onChange={(e) => { setDate(e.target.value) }}
                    />
                </div>
            </div>


            {/* Display selected date  */}
            {date &&
                <h5 className='fw-normal text-center'> Selected: <span className="fw-bold">{customDateAndDayName(date)}</span></h5>
            }


            {/* show action buttons  */}
            {date &&
                <div className="my-4 d-flex justify-content-center font-merriweather">
                    <div className="btn-group gap-2">
                        <button
                            type='button'
                            className="btn btn-sm btn-darkblue2 pt-1"
                            onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                            disabled={showAddActivityForm}
                        >
                            <i className='bi bi-calendar-plus pe-2'></i>
                            Add Activity
                        </button>
                    </div>
                </div>
            }


            {/* add activity form  */}
            {date && showAddActivityForm &&
                <div className="w-100">
                    <div className="text-center">
                        <button
                            className="btn badge btn-secondary"
                            type='button'
                            onClick={() => setShowAddActivityForm(!showAddActivityForm)}
                        > Hide Form
                        </button>
                    </div>
                    <AddAcademicCalendarActivity date={date} />
                </div>
            }


            {/* render selected component  */}
            <div className="">
                {renderComponent()}
            </div>

            {/* reload activities */}
            {date &&
                <div className="d-flex justify-content-center my-5">
                    <button
                        type='button'
                        className='btn btn-sm btn-light'
                        onClick={() => { fetchActivities(date) }}
                    >
                        <i className="bi bi-arrow-clockwise px-1"></i>
                        Reload Activities
                    </button>
                </div>
            }
        </>
    );
}


export default ManageCalendarActivity;

