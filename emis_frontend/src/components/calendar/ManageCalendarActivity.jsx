/**
 * Calling from: ManageAcademicCalendar.jsx
 * Calling to: 
 */


import React, { useState } from 'react';
import { getAccessToken } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';



const ManageCalendarActivity = ({ }) => {
    const accessToken = getAccessToken();
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const [showComponent, setShowComponent] = useState('');


    const handleBack = async () => {
        setShowComponent('CourseList');
    };


    const courseOfferView = (courseOffer) => {
        setShowComponent('CourseDetails')
    }

    const renderComponent = () => {
        switch (showComponent) {
            case '':
                return '< />'
            default:
                return '< />'
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


            {/* render selected component  */}
            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


export default ManageCalendarActivity;

