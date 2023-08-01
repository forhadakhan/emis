/**
 * Calling from: StudentActivity.jsx
 * Calling to: 
 */


import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken, getUserData } from '../../../utils/auth.js';
import { getCurrentDateTimeInSingleStr, getOrdinal } from '../../../utils/utils.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for table support in jsPDF

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
const AcademicRecordList = ({ studentData, setSelectedRecord, setToggle }) => {
    const accessToken = getAccessToken();
    const studnetId = studentData.id;
    const [records, setRecords] = useState([]);
    const [averageCGPA, setAverageCGPA] = useState('');
    const [totalCreditHours, setTotalCreditHours] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [studentInfo, setStudentInfo] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [program, setProgram] = useState('');
    const enrollmentId = studentData.enrollment ? studentData.enrollment.id : '';


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
        if (studnetId) {
            setAlertMessage('');
            fetchRecords(studnetId);
            setSelectedRecord('');
        }
    }, [studnetId]);


    // filteredData is being used for searching, initially set all records as filtered data 
    useEffect(() => {
        setFilteredData(records);
    }, [records]);


    // GET program if there is enrollment and 'program' is empty.
    const getProgram = async () => {
        try {
            const accessToken = getAccessToken();
            const programId = studentData.enrollment ? studentData.enrollment.batch_section.batch_data.program : '';

            const response = await axios.get(
                `${API_BASE_URL}/academy/programs/${programId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setProgram(response.data);
        } catch (error) {
            console.error('Error fetching program:', error);
        }
    }
    if (enrollmentId && !program) {
        getProgram();
    }


    // get student basic info 
    useEffect(() => {
        const data = {
            name: studentData.user ? `Name: ${studentData.user.first_name} ${studentData.user.middle_name} ${studentData.user.last_name}` : '',
            id: studentData.user ? `ID:${studentData.user.username}` : '',
            programme: program
                ? `Programme: ${program.code} - ${program.degree_type.acronym} in ${program.name} (${program.acronym})`
                : '',
            batchSection: enrollmentId
                ? `Batch: ${getOrdinal(studentData.enrollment.batch_section.batch_data.number)}; Section: ${studentData.enrollment.batch_section.name}`
                : '',
            semester: enrollmentId
                ? `Current/Last Semester: ${studentData.enrollment.semester.term.name} ${studentData.enrollment.semester.year}`
                : '',
        };
        setStudentInfo(data);
    }, [enrollmentId, program])


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
                : <AcademicRecordList studentData={studentData} setSelectedRecord={setSelectedRecord} setToggle={setToggle} />
            }
        </div>

    </>);
}



export default StudentAcademicRecords;

