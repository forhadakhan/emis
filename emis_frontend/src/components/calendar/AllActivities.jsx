/**
 * Calling from: ManageAcademicCalendar.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import { customDateAndDayName } from '../../utils/utils.js';


import ShowActivities from './ShowActivities.jsx';



const AllActivities = ({ }) => {
    const accessToken = getAccessToken();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
    const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
    const [error, setError] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [activities, setActivities] = useState([]);
    const [showComponent, setShowComponent] = useState('');
    const [isValidYear, setIsValidYear] = useState(false);
    const months = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
    };
    const minYear = 1900;
    const maxYear = currentYear; // Limit the range to the current year

    // year validation function 
    const validateYear = (year) => {
        const parsedYear = parseInt(year, 10);
        return !isNaN(parsedYear) && parsedYear >= minYear && parsedYear <= maxYear;
    };


    // set and validate year on input change 
    const handleYearChange = (e) => {
        const inputYear = e.target.value;
        setYear(inputYear);
    };


    // validate year on change 
    useEffect(() => {  
        setIsValidYear(validateYear(year) ? true : false);     
    }, [year]);


    // fetch all activities for selected year/month 
    const fetchActivities = async (year, month) => {
        let query = '';
        if (validateYear(year)) {
            query = month ? `year=${year}&month=${month}` : `year=${year}`;
        } else {
            setError(`Please input valid year (${minYear} - ${maxYear})`);
            return;
        }
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
        } catch (error) {
            setError(' Failed to fetch activities.');
            console.error('Error fetching activities:', error);
        }
    };


    // if there activities? show them 
    useEffect(() => {
        if (activities.length > 0) {
            setShowComponent('ShowActivities');
        }
    }, [activities])


    // render selected component 
    const renderComponent = () => {
        switch (showComponent) {
            case 'ShowActivities':
                return <ShowActivities activities={activities} />;
            default:
                return '';
        }
    }

    // clear form data 
    const clearData = () => {
        setMonth('');
        setYear('');
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


            {/* input: year and month  */}
            <div className="d-flex justify-content-center">
                <form action='' className='w-75 w-sm-100 py-5'>

                    {/* year input field, show error if input fails validateYear() */}
                    <div className="row my-2">
                        <div className="col-md-12">
                            <h6 className='text-secondary fw-normal'>
                                Year *
                                <button
                                    type='button'
                                    className='btn btn-sm btn-light mx-2'
                                    onClick={() => { setYear(currentYear) }}
                                >   [current year]
                                </button>
                            </h6>
                            <input
                                type="number"
                                value={year}
                                required
                                onChange={(e) => handleYearChange(e)}
                                placeholder="Enter a year"
                                aria-describedby="validationYearFeedback"
                                className={`form-control ${isValidYear ? '' : 'is-invalid'} d-block w-100 my-2 rounded-3 p-3 pe-5 border border-beige`}
                            />
                            {!isValidYear &&
                                <div id="validationYearFeedback" className="invalid-feedback">
                                    Please input valid year ({minYear} - {maxYear})
                                </div>
                            }
                        </div>
                    </div>


                    {/* month input field  */}
                    <div className="row my-4">
                        <div className="col-md-12">
                            <h6 className='text-secondary fw-normal'>
                                Select a month (optional)
                                <button
                                    type='button'
                                    className='btn btn-sm btn-light mx-2'
                                    onClick={() => { setMonth(currentMonth+1) }}
                                >   [current month]
                                </button>
                            </h6>
                            <select
                                className="form-select d-block w-100 my-2 rounded-3 p-3 border border-beige"
                                aria-label="Month select"
                                value={month}
                                name='month'
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                <option value="">Select Month</option>
                                {Object.entries(months).map(([monthNumber, monthName]) => (
                                    <option key={monthNumber} value={monthNumber}>
                                        {monthName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Display selected year/month */}
                    <div className='mb-4 text-center'>
                        {(year || month) && (
                            <span className="p-2">You selected - </span>
                        )}
                        {year && (<>
                            Year: <span className="p-2 fw-bold">{year}</span>
                        </>)}
                        {month && (<>
                            | Month: <span className="p-2 fw-bold">{months[month]}</span>
                        </>)}
                    </div>


                    {/* submit button  */}
                    <div className="d-flex justify-content-center py-2 gap-3">
                        {/* submit  */}
                        <button
                            className="btn btn-sm btn-beige border border-darkblue fw-bold px-3"
                            type='button'
                            title="Find Activities for selected year/month"
                            onClick={() => { fetchActivities(year, month) }}
                        >
                            <i className="bi bi-calendar pe-2"></i>
                            Find Activities
                        </button>

                        {/* clear form button  */}
                        <button
                            className="btn btn-sm btn-outline-danger rounded-circle p-2 lh-1"
                            type='button'
                            onClick={clearData}
                            title="Clear Form"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                </form>
            </div>


            {/* render selected component  */}
            <div className="">
                {renderComponent()}
            </div>

            {/* reload activities */}
            {(showComponent === 'ShowActivities') &&
                <div className="d-flex justify-content-center my-5">
                    <button
                        type='button'
                        className='btn btn-sm btn-light'
                        onClick={() => { fetchActivities(year, month) }}
                    >
                        <i className="bi bi-arrow-clockwise px-1"></i>
                        Reload Activities
                    </button>
                </div>
            }
        </>
    );
}


export default AllActivities;

