import React from 'react';
import './calendar.css';
import CalendarComponent from './calendar';


const HomeComponent = ({ componentController }) => {
    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue"><i className="bi bi-house-door-fill"></i></h2>
            
            <CalendarComponent componentController={componentController} />
            
        </div>
    );
};

export default HomeComponent;
