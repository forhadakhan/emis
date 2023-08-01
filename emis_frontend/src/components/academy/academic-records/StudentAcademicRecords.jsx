/**
 * Calling from: StudentActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getUserData } from '../../../utils/auth.js';

import AcademicRecordsFAQ from './AcademicRecordsFAQ.jsx';
import RecordDetails from './RecordDetails.jsx';
import BasicStudentInfo from './BasicStudentInfo.jsx';



// Main Component 
const StudentAcademicRecords = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const userData = getUserData();
    const [showComponent, setShowComponent] = useState('StudentRecords');
    const [studentData, setStudentData] = useState('');
    const [error, setError] = useState('');


    // get the selected student 
    const fetchTheStudent = () => {
        setError('');

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const url = `${API_BASE_URL}/student/id/${userData.username}`;

        // Make the API request to get the student 
        axios.get(url, config)
            .then(response => {
                setStudentData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError('An error occurred while retrieving the student.');
                    console.error(error);
                }
            });
    };
    useEffect(() => {
        if (!studentData) {
            fetchTheStudent();
        }
    }, [])


    // add current component in breadcrumb 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('StudentAcademicRecords')}>
            <i className="bi-list-columns"></i> Academic Records
        </button>
    );

    // check and return selected compnent to show  
    const renderComponent = () => {
        switch (showComponent) {
            case 'StudentRecords':
                return <StudentRecords studentData={studentData} setShowComponent={setShowComponent} />;
            default:
                return <><p className='text-center m-5'>Something went wrong while rendering component!</p></>;
        }
    }


    return (
        <>
            {/* breadcrumb */}
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* headings  */}
            <h2 className="text-center m-5 px-2 border-bottom p-3">
                <i className="bi-list-columns"></i> Academic Records
            </h2>

            {/* show error message if there any  */}
            {error &&
                <div className="alert alert-danger alert-dismissible fade show border border-darkblue mx-md-5" role="alert">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <strong> {error} </strong>
                    <button type="button" onClick={() => setError('')} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>}


            {/* render component based on preference  */}
            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



// Sub component to StudentRecords 
const AcademicRecordList = ({ studnetId, setSelectedRecord, setToggle }) => {
    const accessToken = getAccessToken();
    const [records, setRecords] = useState([]);
    const [averageCGPA, setAverageCGPA] = useState('');
    const [totalCreditHours, setTotalCreditHours] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');


    // fetch all records by student id from backend 
    const fetchRecords = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/students/${id}/academic-records/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setRecords(response.data.academic_records);
            setAverageCGPA(response.data.average_cgpa);
            setTotalCreditHours(response.data.total_credit_hours);
        } catch (error) {
            setAlertMessage('Error fetching student records');
            console.error('Error fetching student records:', error);
        }
    };
    useEffect(() => {
        setAlertMessage('');
        fetchRecords(studnetId);
        setSelectedRecord('');
    }, [studnetId]);


    // filteredData is being used for searching, initially set all records as filtered data 
    useEffect(() => {
        setFilteredData(records);
    }, [records]);


    // take a record and return it's course name   
    const getCourseName = (record) => {
        const course = record.course_enrollment.course_offer.course
        return `${course.name}`
    }

    // take a record and return it's course code  
    const getCourseCode = (record) => {
        const course = record.course_enrollment.course_offer.course
        return `${course.acronym}-${course.code}`
    }

    // take a record and return which semester it was taken 
    const getSemester = (record) => {
        const semester = record.course_enrollment.course_offer.semester
        return `${semester.term.name} ${semester.year}`
    }

    // define columns for record list 
    const columns = [
        {
            // course code 
            name: 'Code',
            selector: (row) => getCourseCode(row),
            sortable: true,
            width: '8%',
            center: true,
            cell: (row) => (
                <div>
                    <span className='text-capitalize '>{getCourseCode(row)}</span>
                </div>
            )
        },
        {
            // course name 
            name: 'Course',
            selector: (row) => getCourseName(row),
            sortable: true,
            // width: '14%',
            cell: (row) => (
                <div>
                    <span className='text-capitalize'>{getCourseName(row)}</span>
                </div>
            )
        },
        {
            // term name and year 
            name: 'Semester',
            selector: (row) => row.course_enrollment.course_offer.semester.code,
            sortable: true,
            width: '12%',
            cell: (row) => (
                <div>
                    <span className='text-capitalize'>{getSemester(row)}</span>
                </div>
            )
        },
        {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            width: '14%',
            cell: (row) => (
                <div>
                    <span className='text-capitalize'>{row.course_enrollment.regular ? 'Regular: ' : 'Retake: '}</span>
                    <span className='text-capitalize'>{row.status}</span>
                </div>
            )
        },
        {
            // credit hour 
            name: 'CH',
            // In case the course enrolled as non credit, don't show CH/credit hour 
            selector: (row) => row.course_enrollment.non_credit ? 'Non Credit' : row.course_enrollment.course_offer.course.credit,
            sortable: true,
            width: '9%'
        },
        {
            // Grade point per credit hour 
            name: 'GP/CH',
            selector: (row) => row.grade_point,
            sortable: true,
            width: '8%'
        },
        {
            // letter grade 
            name: 'LG',
            selector: (row) => row.letter_grade,
            sortable: true,
            width: '7%'
        },
    ];

    // define styles for record list 
    const customStyles = {
        rows: {
            style: {
                // minHeight: '72px', // override the row height
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '2px', // override the cell padding for data cells
                paddingRight: '2px',
                // fontWeight: 'bold'
            },
        },
    };


    // handle search input 
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = records.filter(
            (record) =>
                getCourseCode(record).toLowerCase().includes(keyword) ||
                getCourseName(record).toLowerCase().includes(keyword) ||
                getSemester(record).toLowerCase().includes(keyword) ||
                `${record.is_published ? 'Published' : 'Nublished'}`.toLowerCase().includes(keyword) ||
                `${record.course_enrollment.non_credit ? 'non credit' : 'add credit'}`.toLowerCase().includes(keyword) ||
                `${record.course_enrollment.regular ? 'Regular: ' : 'Retake: '}`.toLowerCase().includes(keyword) ||
                `${record.course_enrollment.regular ? 'Regular: ' : 'Retake: '}${record.status}`.toLowerCase().includes(keyword) ||
                record.status.toLowerCase().includes(keyword) ||
                record.course_enrollment.course_offer.course.credit.toString().includes(keyword) ||
                `${record.grade_point}`.toLowerCase().includes(keyword) ||
                `${record.letter_grade}`.toLowerCase().includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    // if a record selected, show details 
    const handleRecordSelect = (record) => {
        setSelectedRecord(record);
        setToggle(true);
    };


    return (
        <div>
            {/* show alert message, if any  */}
            {alertMessage && (
                <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <strong>{alertMessage}</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
                </div>
            )}

            {/* reload and filter options  */}
            <div className="d-flex mx-5">
                {/* reload all records/list  */}
                <div className="me-auto">
                    <button onClick={() => { fetchRecords(studnetId) }} className='btn btn-sm btn-outline-success p-0 px-2'>Reload</button>
                </div>

                {/* filter options  */}
                <div className="mb-3 input-group">
                    <label htmlFor="filter" className="d-flex ms-auto me-2 p-1">
                        Filter:
                    </label>
                    <select id="filter" className="rounded bg-beige text-darkblue p-1" onChange={handleSearch}>
                        <option value="">No Filter</option>
                        <option value="Regular"> Regular </option>
                        <option value="Retake"> Retake </option>
                        <option value="fail"> Fail </option>
                        <option value="retake"> Retake </option>
                        <option value="supplementary"> Supplementary </option>
                        <option value="pass"> Pass </option>
                        <option value="non credit"> Non Credit </option>
                        <option value="add credit"> Credit Only </option>
                    </select>
                </div>
            </div>

            {/* Search input  */}
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>


            {/* list records */}
            <div className="border border-beige">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                    paginationRowsPerPageOptions={[10, 20, 40, 80]}
                    highlightOnHover
                />
            </div>


            {/* total credit and cgpa info  */}
            <div className='my-5 card p-3'>
                <h6 className='fs-6'> Credit completed: <strong>{totalCreditHours}</strong> </h6>
                <h6 className='fs-6'> CGPA: <strong>{averageCGPA}</strong> </h6>
            </div>


            {/* faq or information  */}
            <AcademicRecordsFAQ />

        </div>
    );
};


// Sub Component to StudentAcademicRecords 
const StudentRecords = ({ studentData }) => {
    const [selectedRecord, setSelectedRecord] = useState('');
    const [toggle, setToggle] = useState(false);


    return (<>

        {/* display basic student info  */}
        <BasicStudentInfo studentData={studentData} />

        {/* toggle between list and details  */}
        <div>
            {/* in case detail view, show link to record list  */}
            {toggle && <div className="">
                {/* records list link  */}
                <a className="icon-link icon-link-hover" href="#" onClick={() => { setToggle(false) }}>
                    <small>
                        <i className="bi bi-arrow-bar-left"></i> Goto Record List
                    </small>
                </a>
            </div>}

            {/* show list/detail component based on toggle value  */}
            {toggle
                // if toggle is true, then show a record details 
                ? <RecordDetails record={selectedRecord} setToggle={setToggle} />
                // if toggle is false, show all records / list 
                : <AcademicRecordList studnetId={studentData.id} setSelectedRecord={setSelectedRecord} setToggle={setToggle} />
            }
        </div>

    </>);
}



export default StudentAcademicRecords;

