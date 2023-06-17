import React, { useState, useEffect } from 'react';
import './calendar.css';

const CalendarComponent = ({ componentController }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        setCurrentMonth(selectedDate.getMonth());
        setCurrentYear(selectedDate.getFullYear());
    }, [selectedDate]);

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
            const dateId = `${dayStr}-${monthStr}-${yearStr}`;
            const classNames = applyDayStyles(dateId, currentDate);
            calendarDays.push(
                <button
                    key={`day-${day}`}
                    className={`btn ${classNames} ${isCurrentDay ? 'selected' : ''}`}
                    onClick={() => handleDayClick(dateId)}
                    type="button"
                    id={dateId}
                >
                    {day}
                </button>
            );
        }

        return calendarDays;
    };




    return (
        <div className="container p-3">
            <div className="text-darkblue p-2">
                <h4 className="text-center shadow fs-5 bg-darkblue text-beige mx-2 my-4 p-2 border border-beige rounded-3">
                    <a href="#" onClick={handleAcademicCalendar} className="text-decoration-none text-beige">
                        Academic Calendar &nbsp;
                        <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                </h4>


                {/* <h3 className="pb-2 border-bottom text-darkblue p-3"><a href="#" onClick={handleAcademicCalendar} className="text-decoration-none text-darkblue">
                    Academic Calendar &nbsp;
                    <i className="bi bi-box-arrow-up-right"></i>
                </a></h3> */}

                <div className="p-2">
                    <div className="row">
                        <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-start">
                            <div id="month" className="bg-light p-2 mx-0 shadow border border-beige rounded-3 w-340px h-100">
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
                                    <div id="day-name" className="cal-weekdays text-body-secondary">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="cal-weekday">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div id="day-number" className="cal-days">
                                        {generateCalendarDays()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="d-block d-md-none m-3 border-0" />


                        <div className="col-md-8">
                            <div id="day" className="bg-light p-3 mx-0 overflow-auto shadow border border-beige rounded-3 h-100">
                                <div className="d-flex align-items-center border-bottom pb-2">
                                    <strong id="selected-date" className="fs-5 flex-grow-1">
                                        <span className="text-darkblue"> {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })} </span>
                                        <span className="fw-light"> {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} </span>
                                    </strong>
                                    <button type="button" className="btn btn-darkblue rounded-5 btn-sm fw-semibold">
                                        Add Event
                                    </button>
                                </div>

                                <div className="my-2">
                                    <ul id="day-event-list">
                                        <li id="day-event-1">Todays event: 1</li>
                                        <li id="day-event-2">Todays event: 2</li>
                                        <li id="day-event-3">Todays event: 3</li>
                                    </ul>
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
