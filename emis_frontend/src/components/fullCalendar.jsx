import React, { useState, useEffect } from 'react';
import './calendar.css';

const AcademicCalendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        setCurrentMonth(selectedDate.getMonth());
        setCurrentYear(selectedDate.getFullYear());
    }, [selectedDate]);


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
            const isCurrentDay = monthNumber+1 === selectedDate.getMonth() && day === selectedDate.getDate();
            const dayStr = day.toString().padStart(2, '0');
            const monthStr = (monthNumber).toString().padStart(2, '0');
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
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue">Academic Calendar</h2>

            <div id="full-cal" className="container">
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 py-4">
                    {months.map((month, index) => (
                        <div key={index} id="month" className="col">
                            <div className="bg-light p-2 mx-0 shadow border border-beige rounded-3 w-340px h-100 mx-auto">
                                <div className="cal">
                                    <div className="cal-month d-block text-center">
                                        <button className={`btn btn-sm cal-btn w-100 flex-grow-1 ${index==currentMonth ? 'cal-today' : ''}`} type='button'>
                                            <strong className='fs-4'>{month}</strong>
                                        </button>
                                    </div>
                                    <div id="day-name" className="cal-weekdays text-body-secondary">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="cal-weekday">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div id="day-number" className="cal-days">
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
