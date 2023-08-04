/**
 * Calling from: Home.jsx
 * Calling to: 
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import '../../styles/calendar.css';
import { dateShortener } from '../../utils/utils.js';

import ShowActivities from './ShowActivities.jsx';

const CalendarComponent = ({ componentController }) => {
    const accessToken = getAccessToken();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateActivities, setSelectedDateActivities] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [activities, setActivities] = useState([]);
    const [checkActivity, setCheckActivity] = useState(false);
    const [checkWeekends, setCheckWeekends] = useState(false);
    const [weekends, setWeekends] = useState([]);
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


    // fetch all activities by year/month 
    const fetchActivities = async (year, month) => {
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
            fetchActivities(currentYear, currentMonth + 1);
        }
    }, [activities])


    // find out how many activities a date has (only for selected month) 
    const getActivityCountByDate = (date) => {
        const activitiesOnDate = activities.filter(activity => activity.date === date);
        return activitiesOnDate.length;
    }

    // get all activities for a date (only for selected month) 
    const getActivitiesByDate = (date) => {
        const activitiesOnDate = activities.filter(activity => activity.date === date);
        return activitiesOnDate;
    }

    // get all activities for selected date (only for selected month) 
    const getActivitiesForSelectedDate = () => {
        const date = dateShortener(selectedDate);
        const activitiesOnDate = getActivitiesByDate(date);
        setSelectedDateActivities(activitiesOnDate);
    }
    useEffect(() => {
        getActivitiesForSelectedDate();
    }, [selectedDate])


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


    // const handleMonthChange = (e) => {
    //     setCurrentMonth(e.target.value);
    //     setSelectedDate(new Date(currentYear, e.target.value, 1));
    // };

    // const handleYearChange = (e) => {
    //     setCurrentYear(e.target.value);
    //     setSelectedDate(new Date(e.target.value, currentMonth, 1));
    // };

    const handleAcademicCalendar = () => {
        componentController('academic_calendar');
    };

    const handlePreviousMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handlePreviousYear = () => {
        setSelectedDate(new Date(currentYear - 1, currentMonth, 1));
    };

    const handleNextYear = () => {
        setSelectedDate(new Date(currentYear + 1, currentMonth, 1));
    };

    const handleResetDate = () => {
        setSelectedDate(new Date());
    };

    const handleDayClick = (dateId) => {
        const [day, month, year] = dateId.split('-').map(Number);
        const newSelectedDate = new Date(year, month - 1, day); // month is 0 indexed 
        setSelectedDate(newSelectedDate);
    };

    const applyDayStyles = (dateId, currentDate) => {
        const classNames = ['cal-btn'];
        if (dateId === currentDate) {
            classNames.push('cal-today');
        }
        return classNames.join(' ');
    };

    const generateCalendarDays = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const calendarDays = [];
        const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');

        // Add empty cells for previous month's days
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<button key={`empty-${i}`} className="btn cal-btn" disabled />);
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = currentMonth === selectedDate.getMonth() && day === selectedDate.getDate();
            const currentDateObj = new Date();
            const dayStr = day.toString().padStart(2, '0');
            const monthStr = (currentMonth + 1).toString().padStart(2, '0');
            const yearStr = currentYear.toString();
            const dateId = `${dayStr}-${monthStr}-${yearStr}`; //
            const date = `${yearStr}-${monthStr}-${dayStr}`;
            const classNames = applyDayStyles(dateId, currentDate);
            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={`btn ${classNames} ${isCurrentDay ? 'selected' : ''} cal-day p-1`}
                    onClick={() => handleDayClick(dateId)}
                    type="button"
                    id={dateId}
                >
                    <span className={`highlight ${getActivityCountByDate(date) > 0 ? 'has-activity' : ''} w-100 py-1`}>
                        <span className="circle-content">{day}</span>
                    </span>
                </button>
            );
        }

        return calendarDays;
    };


    return (
        <div className="container p-3">
            <div className="text-darkblue p-2">

                <div className="p-2">
                    <div className="row">

                        {/* month  */}
                        <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-start">
                            <div id="month" className="bg-light p-2 mx-0 shadow border border-beige rounded-3 w-350px h-100">
                                <div className="cal">
                                    <div className="cal-month d-flex">
                                        <button id="previous-year" className="btn cal-btn flex-grow-1" onClick={handlePreviousYear} type="button">
                                            <i className="bi bi-chevron-double-left"></i>
                                        </button>
                                        <button id="previous-month" className="btn btn-sm cal-btn flex-grow-1" onClick={handlePreviousMonth} type="button">
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                        <button className="btn btn-sm cal-btn flex-grow-1">
                                            <strong>{months[currentMonth]} {currentYear}</strong>
                                        </button>
                                        <button id="next-month" className="btn cal-btn flex-grow-1" onClick={handleNextMonth} type="button">
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                        <button id="next-year" className="btn cal-btn flex-grow-1" onClick={handleNextYear} type="button">
                                            <i className="bi bi-chevron-double-right"></i>
                                        </button>
                                    </div>
                                    <div className="d-grid">
                                        <button className="btn btn-sm btn-darkblue" onClick={handleResetDate} type="button"><i className="bi bi-clock-history"></i></button>
                                    </div>
                                    <div id="day-name" className="cal-weekdays text-body-secondary gap-1 my-1">
                                        {Object.keys(daysOfWeek).map((day) => (
                                            <div key={day} className={`cal-weekday fw-bold rounded ${isWeekend(daysOfWeek[day]) ? 'weekend' : ''}`}>
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div id="day-number" className="cal-days gap-1">
                                        {generateCalendarDays()}
                                    </div>
                                    <div className="d-grid pt-2">
                                        <a href="#" onClick={handleAcademicCalendar} className="text-decoration-none btn btn-sm btn-darkblue">
                                            Academic Calendar &nbsp;
                                            <i className="bi bi-box-arrow-up-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="d-block d-md-none m-3 border-0" />

                        {/* day and activity  */}
                        <div className="col-md-8">
                            <div id="day" className="bg-light p-3 mx-0 overflow-auto shadow border border-beige rounded-3 h-100">
                                <div className="d-flex align-items-center border-bottom pb-2">
                                    <strong id="selected-date" className="fs-5 flex-grow-1">
                                        <span className="text-darkblue"> {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })} </span>
                                        <span className="fw-light"> {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} </span>
                                    </strong>

                                    {/* <button type="button" className="btn btn-darkblue rounded-5 btn-sm fw-semibold">
                                        Add Event
                                    </button> */}

                                </div>

                                <div className="my-2 overflow-scroll" style={{ maxHeight: '350px' }}>

                                    <ShowActivities activities={selectedDateActivities} />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarComponent;
