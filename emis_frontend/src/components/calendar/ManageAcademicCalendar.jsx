/**
 * Calling from: ManagerialActivity.jsx
 * Calling to: 
 */


import React, { useState } from 'react';


const ManageAcademicCalendar = ({ setActiveComponent, breadcrumb }) => {
    const [error, setError] = useState('');
    const [showComponent, setShowComponent] = useState('');


    // add current component to the breadcrumb list 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageAcademicCalendar')} type='button'>
            <i className="bi bi-calendar3"></i> Manage Academic Calendar
        </button>
    );


    const renderComponent = () => {
        switch (showComponent) {
            default:
                return ''
        }
    }

    return (
        <>
            {/* show breadcrumb list  */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>


            {/* show page title  */}
            <h2 className="text-center m-5 px-2 font-merriweather">
                <i className="bi bi-calendar3"></i> Manage Academic Calendar
            </h2>


            {/* show error message if any  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}


            {/* show action tabs/links  */}
            <div className="">
                <ul className="mb-5 nav nav-tabs px-sm-5 gap-1 justify-content-center">
                    <li className="nav-item text-darkblue">
                        <a
                            className={`py-1 nav-link ${showComponent === 'ManageCalendarActivity' ? 'active' : 'bg-beige'}`}
                            href="#"
                            onClick={() => { setShowComponent('ManageCalendarActivity') }}
                        >
                            <span className="text-darkblue">Activity</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`py-1 nav-link ${showComponent === 'AllActivities' ? 'active' : 'bg-beige'}`}
                            href="#"
                            onClick={() => { setShowComponent('AllActivities') }}
                        >
                            <span className="text-darkblue">Get All</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`py-1 nav-link ${showComponent === 'ManageWeekends' ? 'active' : 'bg-beige'}`}
                            href="#"
                            onClick={() => { setShowComponent('ManageWeekends') }}
                        >
                            <span className="text-darkblue">Weekends</span>
                        </a>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li> */}
                </ul>
            </div>


            {/* render selected component  */}
            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


export default ManageAcademicCalendar;

