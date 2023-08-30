import React from 'react';

import '../styles/calendar.css';
import CalendarComponent from './calendar/Calendar';

import ListPosts from './media/ListPosts'


const HomeComponent = ({ componentController }) => {
    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue"><i className="bi bi-house-door-fill"></i></h2>
            
            <CalendarComponent componentController={componentController} />

            <div className="container p-3">
            <div className="text-darkblue p-2">
                <ListPosts />
            </div>  
            </div>  
            
        </div>
    );
};

export default HomeComponent;
