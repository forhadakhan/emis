/**
 * Calling from: ManagerialActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken } from '../../../utils/auth.js';
import { getCurrentDateTimeInSingleStr } from '../../../utils/utils.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for table support in jsPDF

import AcademicRecordsFAQ from './AcademicRecordsFAQ.jsx';
import RecordDetails from './RecordDetails.jsx';
import BasicStudentInfo from './BasicStudentInfo.jsx';
import getBasicStudentInfo from './utils.js';



// Main Component 
const ManageAcademicRecords = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('FindAStudent');
    const [studnetId, setStudnetId] = useState('');
    const [studentData, setStudentData] = useState('');

    // add current component in breadcrumb 
    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageAcademicRecords')}>
            <i className="bi-list-columns"></i> Manage Academic Records
        </button>
    );

    // check and return selected compnent to show  
    const renderComponent = () => {
        switch (showComponent) {
            case 'ListAllStudent':
                return <ListAllStudent setStudnetId={setStudnetId} />;
            case 'FindAStudent':
                return <FindAStudent setStudnetId={setStudnetId} />;
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
            <h2 className="text-center m-5 px-2">
                <i className="bi-list-columns"></i> Manage Academic Records
            </h2>

            {/* student select option  */}
            <nav className="nav nav-pills flex-column flex-sm-row my-4">

                {/* option to find a student by username  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'FindAStudent'}
                    onClick={() => setShowComponent('FindAStudent')}>
                    Find a student
                </button>

                {/* option to find a student from all student list  */}
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'ListAllStudent'}
                    onClick={() => setShowComponent('ListAllStudent')}>
                    List all student
                </button>
            </nav>

            {/* render component based on preference  */}
            <div className="">
                <GetTheStudent setShowComponent={setShowComponent} username={studnetId} setStudentData={setStudentData} />
                {renderComponent()}
            </div>
        </>
    );
}


// Sub Component to ManageAcademicRecords
const GetTheStudent = ({ setShowComponent, username, setStudentData }) => {
    const [error, setError] = useState('');
    const accessToken = getAccessToken();

    // get the selected student 
    const fetchTheStudent = () => {
        setError('');

        // Configure the request headers
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const url = `${API_BASE_URL}/student/id/${username}`;

        // Make the API request to get the student 
        axios.get(url, config)
            .then(response => {
                setStudentData(response.data);
                setShowComponent('StudentRecords')
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
        if (username) {
            fetchTheStudent();
        }
    }, [username])


    return (<>
        {error &&
            <div className="alert alert-danger alert-dismissible fade show border border-darkblue mx-md-5" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <strong> {error} </strong>
                <button type="button" onClick={() => setError('')} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
    </>);

}


// Sub Component to ManageAcademicRecords  
const FindAStudent = ({ setStudnetId }) => {
    const [username, setUsername] = useState('');
    setStudnetId('');

    const handleFindUser = (e) => {
        e.preventDefault();
        setStudnetId(username);
    }

    return (
        <div>
            <form onSubmit={handleFindUser}>
                <div className="mb-3 my-5 mx-md-5">
                    <label htmlFor="usernameInput" className="form-label"><i className="bi bi-input-cursor-text"></i> Enter username</label>
                    <input
                        className="form-control border border-darkblue text-center"
                        type="text"
                        placeholder="Enter the student id/username."
                        aria-label="usernameInput"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="mb-3 m-3 d-flex">
                    <button className="btn btn-darkblue mx-auto pt-1" disabled={username.length < 1} type='submit'>
                        <span><i className="bi bi-search"></i></span>  Find
                    </button>
                </div>
            </form>
        </div>
    );
}


// Sub component to ListAllStudent 
const StudentList = ({ studentUsers, setStudnetId }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setData(studentUsers);
    }, [studentUsers]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = data.filter(
            (user) =>
                user.pk.toString().toLowerCase().includes(keyword) ||
                user.fields.username.toLowerCase().includes(keyword) ||
                user.fields.first_name.toLowerCase().includes(keyword) ||
                user.fields.last_name.toLowerCase().includes(keyword) ||
                user.fields.email.toLowerCase().includes(keyword) ||
                ((user.fields.is_active && (keyword === 'active' || keyword === 'unblocked')) ||
                    (!user.fields.is_active && (keyword === 'inactive' || keyword === 'blocked')))
        );
        setFilteredData(filteredResults);
    };

    const columns = [
        {
            name: 'ID/Username',
            selector: (row) => row.fields.username,
            sortable: true,
            width: '14%'
        },
        {
            name: 'First Name',
            selector: (row) => row.fields.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.fields.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.fields.email,
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <div className='mx-auto'>
                    {/* view student select button */}
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2 border-0"
                        onClick={() => handleSelect(row.fields.username)}
                        data-bs-toggle="tooltip"
                        data-bs-title="Select this student"
                    >
                        Select
                    </button>
                </div>
            ),
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
                fontWeight: 'bold'
            },
        },
    };

    const handleSelect = (username) => {
        setStudnetId(username);
    };


    return (
        <div>

            {/* filter options  */}
            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                    <option value="unblocked">Not Blocked</option>
                </select>
            </div>

            {/* search input field  */}
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            {/* list  */}
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                customStyles={customStyles}
                className='rounded rounded-4 border border-beige'
            />
        </div>
    );
};


// Sub Component to ManageAcademicRecords 
const ListAllStudent = ({ setStudnetId }) => {
    const accessToken = getAccessToken();
    const [studentUsers, setStudentUsers] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    setStudnetId('');

    // fetch  users with 'student' role for StudentList
    useEffect(() => {
        setAlertMessage('');
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/student/users/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setStudentUsers(response.data);
            } catch (error) {
                setAlertMessage('Error fetching student users');
                console.error('Error fetching student users:', error);
            }
        };
        fetchUserData();
    }, []);


    return (<>
        {alertMessage && (
            <div className={`alert alert-info alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                <strong>{alertMessage}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
            </div>
        )}

        {/* render student user list  */}
        <div>
            <StudentList studentUsers={studentUsers} setStudnetId={setStudnetId} />
        </div>

    </>)
}


// Sub component to StudentRecords 
const AcademicRecordList = ({ studentData, setSelectedRecord, setToggle }) => {
    const accessToken = getAccessToken();
    const studnetId = studentData.id;
    const [records, setRecords] = useState([]);
    const [averageCGPA, setAverageCGPA] = useState('');
    const [totalCreditHours, setTotalCreditHours] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [studentInfo, setStudentInfo] = useState('');


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


    // get student basic info 
    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const studentInfo = await getBasicStudentInfo({ studentData });
                setStudentInfo(studentInfo);
            } catch (error) {
                console.error('Error fetching student info:', error);
            }
        }
        if (!studentInfo) {
            fetchStudentInfo();
        }
    }, [studentInfo])


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
            width: '16%',
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
            width: '7%'
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
        {
            name: 'Action',
            button: true,
            cell: (row) => (
                <div className='mx-auto'>
                    {/* view student select button */}
                    {row.is_published
                        ? <i className="bi bi-check-square pe-1" data-bs-toggle="tooltip" title="Published"></i>
                        : <i className="bi bi-x-square pe-1" data-bs-toggle="tooltip" title="Not Published"></i>
                    }
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-dark me-2 border-0"
                        onClick={() => handleRecordSelect(row)}
                    >
                        Select
                    </button>
                </div>
            ),
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


    // get and memorize all records, use in export pdf for efficiency 
    const tableData = useMemo(() => {
        // Sort the filteredData by semester code  
        const sortedData = [...filteredData].sort((a, b) => {
            const codeA = a.course_enrollment.course_offer.semester.code;
            const codeB = b.course_enrollment.course_offer.semester.code;
            if (codeA < codeB) {
                return -1;
            }
            if (codeA > codeB) {
                return 1;
            }
            return 0;
        });

        return sortedData.map((record) => [
            getCourseCode(record),
            getCourseName(record),
            getSemester(record),
            `${record.course_enrollment.regular ? 'Regular: ' : 'Retake: '}${record.status}`,
            `${record.course_enrollment.non_credit ? 'Non Credit' : record.course_enrollment.course_offer.course.credit}`,
            record.grade_point,
            record.letter_grade,
        ]);
    }, [filteredData]);

    // export PDF using jsPDF 
    const exportPDF = () => {
        const doc = new jsPDF();

        const headline = 'Academic Records';

        const headers = [['Code', 'Course', 'Semester', 'Status', 'CH', 'GP/CH', 'LG']];
        const headerStyles = {
            fillColor: [1, 1, 50],
            textColor: [238, 212, 132],
            lineWidth: 0.1,
        };

        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getStringUnitWidth(headline) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        const textY = 15;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(headline, textX, textY);


        // Add studentInfo just after the headline
        const infoStartX = 15;
        let infoStartY = textY + 10;
        const infoLineHeight = 5;
        doc.setFont('helvetica', 'bold');
        for (const [key, value] of Object.entries(studentInfo)) {
            doc.setFontSize(10);
            doc.text(`${value}`, infoStartX, infoStartY, { baseline: 'start' });
            infoStartY += infoLineHeight;
        }

        // const tableStartY = doc.internal.getFontSize() + infoStartY;
        const tableStartY = 5 + infoStartY;
        const tableEndY = doc.autoTable.previous.finalY;
        doc.setFont('helvetica', 'normal');

        // Table Generation
        doc.autoTable({
            startY: tableStartY,
            head: headers,
            body: tableData,
            didDrawCell: (data) => {
                // Empty didDrawCell to not override styles
            },
            headStyles: headerStyles,
        });
        
        // Calculate the space required for studentInfo, and table
        let totalRequiredSpace = tableEndY + 30; // You can adjust this value as needed
    
        // If the required space exceeds the page height, add a new page
        const pageHeight = doc.internal.pageSize.getHeight();
        let currentPage = 1;
        while (totalRequiredSpace > pageHeight) {
            doc.addPage();
            totalRequiredSpace -= pageHeight;
            currentPage += 1;
        }

        // Show average cgpa and total credit hours after the table
        const totalInfoStartX = 15;
        const totalInfoStartY = totalRequiredSpace + 10; 
        const cgpa = `CGPA: ${averageCGPA}`;
        const ch = `Credit completed: ${totalCreditHours}`;
        doc.setFont('helvetica', 'bold');
        doc.text(cgpa, totalInfoStartX, totalInfoStartY);
        doc.text(ch, totalInfoStartX, totalInfoStartY + 5);


        // Footer Generation
        const totalPages = doc.internal.getNumberOfPages();
        doc.setFont('helvetica', 'normal');

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);

            // Footer note
            const footerNote = "Note: This is a draft academic record, not an official document without an authorized seal and signature.";
            const noteX = pageWidth - 130;
            const noteY = doc.internal.pageSize.getHeight() - 10;
            doc.setFontSize(8);
            doc.text(footerNote, noteX, noteY, { align: 'center' });

            // Page numbers
            const pageNumber = `Page ${i} of ${totalPages}`;
            const pageX = pageWidth - 20;
            const pageY = doc.internal.pageSize.getHeight() - 10;
            doc.text(pageNumber, pageX, pageY, { align: 'right' });
        }
        const timenow = getCurrentDateTimeInSingleStr();
        const fileName = `${studentInfo.id}__Academic-Records__${timenow}.pdf`;
        doc.save(fileName);
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
                        <option value="Published"> Published </option>
                        <option value="Nublished"> Not Published </option>
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


            {/* export button(s)  */}
            <div className="d-flex justify-content-center my-5">
                <button className="btn btn-sm btn-darkblue" onClick={exportPDF}>
                    <i className="bi bi-file-pdf px-1"></i>
                    Export as PDF
                </button>
            </div>


            {/* faq or information  */}
            <AcademicRecordsFAQ />

        </div>
    );
};


// Sub Component to ManageAcademicRecords 
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
                : <AcademicRecordList studentData={studentData} setSelectedRecord={setSelectedRecord} setToggle={setToggle} />
            }
        </div>

    </>);
}



export default ManageAcademicRecords;

