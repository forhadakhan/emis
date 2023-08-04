/**
 * Calling from: Landing.jsx
 * Calling to: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import '../../styles/calendar.css';
import { dateShortener } from '../../utils/utils.js';


const AcademicCalendar = () => {
    const accessToken = getAccessToken();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [weekends, setWeekends] = useState([]);
    const [checkWeekends, setCheckWeekends] = useState(false);
    const [activities, setActivities] = useState([]);
    const [checkActivity, setCheckActivity] = useState(false);
    const [error, setError] = useState('');

    const daysOfWeek = {
        Sun: 'Sunday',
        Mon: 'Monday',
        Tue: 'Tuesday',
        Wed: 'Wednesday',
        Thu: 'Thursday',
        Fri: 'Friday',
        Sat: 'Saturday'
    };
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        setCurrentMonth(selectedDate.getMonth());
        setCurrentYear(selectedDate.getFullYear());
    }, [selectedDate]);


    // fetch all from Weekends model  
    const fetchWeekends = async () => {
        setError('');

        const url = `${API_BASE_URL}/calendar/weekends/?status=1`;

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
            setCheckWeekends(true); // in case there is no weekends
        } catch (error) {
            setError(' Failed to fetch Weekends data.');
            console.error('Error fetching Weekends data:', error);
        }
    };
    // fetch only if weekends is empty 
    useEffect(() => {
        if (!checkWeekends && (weekends.length < 1)) {
            fetchWeekends()
        }
    }, [weekends]);

    // check if a day is weekend 
    const isWeekend = (day) => {
        for (const weekend of weekends) {
            if (weekend.day === day) {
                return weekend.status;
            }
        }
        return false;
    }


    // fetch all activities by year/month 
    const fetchActivities = async (year, month = '') => {
        const query = month ? `year=${year}&month=${month}` : `year=${year}`;
        setError('');

        const url = `${API_BASE_URL}/calendar/academic-activity/?${query}`;

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(url, config);
            setActivities(response.data);
            setError('');
            setCheckActivity(true); // in case there is no activities 
        } catch (error) {
            setError(' Failed to fetch activities.');
            console.error('Error fetching activities:', error);
        }
    };
    // if there are no activities, try to get activities for current month through api  
    useEffect(() => {
        if (!checkActivity && (activities.length < 1)) {
            fetchActivities(currentYear);
        }
    }, [activities])


    // find out how many activities a date has (only for selected month) 
    const getActivityCountByDate = (date) => {
        const activitiesOnDate = activities.filter(activity => activity.date === date);
        return activitiesOnDate.length;
    }

    // find out this is a holiday 
    const isHoliday = (date) => {
        const holidayActivity = activities.find(activity => activity.date === date && activity.status === "OFF-DAY");
        return !!holidayActivity;
    }




    const handleDayClick = (dateId) => {
        const [day, month, year] = dateId.split('-').map(Number);
        // const newSelectedDate = new Date(currentYear, currentMonth, day);
        const newSelectedDate = new Date(year, month - 1, day); // month is 0 indexed 
        setSelectedDate(newSelectedDate);
    };

    const applyDayStyles = (dateId, currentDate) => {
        const classNames = ['btn', 'cal-btn'];
        if (dateId === currentDate) {
            classNames.push('cal-today');
        }
        return classNames.join(' ');
    };

    const generateCalendarDays = (monthNumber) => {
        const daysInMonth = new Date(currentYear, monthNumber, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, monthNumber - 1, 1).getDay();
        const calendarDays = [];
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');


        // Add empty cells for previous month's days
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="calendar-day empty-day"></div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = monthNumber + 1 === selectedDate.getMonth() && day === selectedDate.getDate();
            const dayStr = day.toString().padStart(2, '0');
            const monthStr = (monthNumber).toString().padStart(2, '0');
            const yearStr = currentYear.toString();
            const dateId = `${dayStr}-${monthStr}-${yearStr}`; // DD-MM-YYYY
            const date = `${yearStr}-${monthStr}-${dayStr}`; // YYYY-MM-DD
            const classNames = applyDayStyles(dateId, currentDate);
            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={`btn ${classNames} ${isCurrentDay ? 'selected' : ''} cal-day p-1`}
                    onClick={() => handleDayClick(dateId)}
                    type="button"
                    id={dateId}
                >
                    <span className={`highlight ${getActivityCountByDate(date) > 0 ? 'has-activity' : ''} ${isHoliday(date) ? 'weekend' : ''} w-100 py-1`}>
                        <span className="circle-content">{day}</span>
                    </span>
                </button>
            );
        }

        return calendarDays;
    };


    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue">Academic Calendar</h2>

            <div id="full-cal" className="container">
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 py-4">
                    {months.map((month, index) => (
                        <div key={index} id="month" className="col">
                            <div className="bg-light p-2 mx-0 shadow border border-beige rounded-3 w-350px h-100 mx-auto">
                                <div className="cal">

                                    {/* show month name  */}
                                    <div className="cal-month d-block text-center">
                                        <button className={`btn btn-sm cal-btn w-100 flex-grow-1 ${index == currentMonth ? 'cal-today' : ''}`} type='button'>
                                            <strong className='fs-4'>{month}</strong>
                                        </button>
                                    </div>

                                    {/* generate day names  */}
                                    <div id="day-name" className="cal-weekdays text-body-secondary gap-1 my-1">
                                        {Object.keys(daysOfWeek).map((day) => (
                                            <div key={day} className={`cal-weekday fw-bold rounded ${isWeekend(daysOfWeek[day]) ? 'weekend' : ''}`}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* generate month dates  */}
                                    <div id="day-number" className="cal-days gap-1">
                                        {generateCalendarDays(index + 1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;
