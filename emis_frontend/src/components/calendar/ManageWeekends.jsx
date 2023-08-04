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

        </>
    );
}



export default ManageWeekends;

