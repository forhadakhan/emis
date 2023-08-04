/**
 * Calling from: ManageAcademicCalendar.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';


// Main component 
const ManageWeekends = ({ }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [weekends, setWeekends] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const days = {
        Sunday: 'Sunday',
        Monday: 'Monday',
        Tuesday: 'Tuesday',
        Wednesday: 'Wednesday',
        Thursday: 'Thursday',
        Friday: 'Friday',
        Saturday: 'Saturday',
    };


    // fetch all from Weekends model  
    const fetchWeekends = async () => {
        setError('');

        const url = `${API_BASE_URL}/calendar/weekends/`;

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(url, config);
            setWeekends(response.data);
            setError('');
        } catch (error) {
            setError(' Failed to fetch Weekends data.');
            console.error('Error fetching Weekends data:', error);
        }
    };
    // fetch only if weekends is empty 
    useEffect(() => {
        if (weekends.length < 1) {
            fetchWeekends()
        }
    }, [weekends]);


    // get an obj form weekends by day name 
    const getWeekDay = (dayName) => {
        if(weekends.length < 1) {
            return;
        }
        return weekends.find((weekend) => weekend.day === dayName);
    };


    // get weekend status form 'weekends' by day name 
    const getWeekendStatus = (dayName) => {
        if(weekends.length < 1) {
            return;
        }
        const day = weekends.find((weekend) => weekend.day === dayName);
        return day.status;
    };

    // show update modal when a day is selected 
    const handleWeekend = (day) => {
        setSelectedDay(getWeekDay(day));
        setShowUpdateModal(true);
    };


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


            <div className="text-center">
                <button className="btn btn-sm btn-light" onClick={() => { fetchWeekends() }}>
                    <i className="bi bi-arrow-clockwise pe-1"></i> reload
                </button>
            </div>


            {/* generate buttons for all week days with on click update modal open option  */}
            <div className='d-flex justify-content-center'>
                <div className="px-5">
                    {Object.entries(days).map(([dayNumber, dayName]) => (
                        <button
                            key={`${dayNumber}-${dayName}`}
                            className='btn btn-outline-danger fs-4 bg-darkblue text-beige my-3 p-3 w-100 d-flex justify-content-between'
                            onClick={() => handleWeekend(dayNumber)}
                            title={getWeekendStatus(dayName) ? 'WEEKEND' : 'REGULAR-DAY'}
                        >
                            <span className='px-2 pe-5'>{dayName}</span>
                            {getWeekendStatus(dayName)
                                ? <i className="bi bi-pause-fill"></i>
                                : <i className="bi bi-caret-right"></i>
                            }
                        </button>
                    ))}
                </div>
            </div>


            {/* if a day is selected / showUpdateModal is true, show update modal  */}
            {showUpdateModal &&
                <UpdateWeekend
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                    selectedDay={selectedDay}
                    setWeekends={setWeekends}
                />}

        </>
    );
}



// Sub-component to ManageWeekends 
const UpdateWeekend = ({ show, handleClose, setWeekends, selectedDay }) => {
    const [selected, setSelected] = useState(selectedDay);
    const [updateMessage, setUpdateMessage] = useState('');
    const accessToken = getAccessToken();
    const status = selected.status;


    const handleUpdate = async (e) => {
        setUpdateMessage('');
        const data = {
            day: selected.day,
            status: !status
        }

        const url = `${API_BASE_URL}/calendar/weekends/${selected.id}/`;

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.put(url, data, config);
            setSelected(response.data);
            setUpdateMessage('Updated Successfully!');
            setWeekends([]);
        } catch (error) {
            setUpdateMessage(' Failed to update data.');
            console.error('Error: failed to update data:', error);
        }
    };

    return (<>

        <div className="bg-blur">
            <div className={`modal ${show ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: show ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content border border-beige">

                        <div className="modal-header bg-darkblue text-beige">

                            {/* show title with day name  */}
                            <h5 className="modal-title fs-4">
                                <i className="bi bi-pen pe-2"></i>
                                {status
                                    ? <span>Unset <span className='badge bg-success'>{selected.day}</span> as weekend.</span>
                                    : <span>Set <span className='badge bg-danger'>{selected.day}</span> as weekend.</span>
                                }
                            </h5>
                            <button type="button" className="close btn bg-beige border-2 border-beige" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="modal-body">

                            {/* show update response message  */}
                            {updateMessage ? <div className='p-3 text-center'>{updateMessage}</div> : <div className='p-3'>ㅤ</div>}

                            {/* show update button, change text depending on status  */}
                            <button
                                type="button"
                                className={`btn ${status ? 'btn-darkblue2 pt-1' : 'btn-danger'} rounded fw-medium d-flex mx-auto`}
                                onClick={() => { handleUpdate() }}
                            >
                                <i className="bi bi-sd-card pe-2"></i>
                                {status
                                    ? 'Set as regular day'
                                    : 'Set as weekend'
                                }
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};


export default ManageWeekends;

