/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';
import Select from 'react-select'
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for table support in jsPDF


const ManageCourses = ({ setActiveComponent, breadcrumb }) => {
    const accessToken = getAccessToken();
    const [showComponent, setShowComponent] = useState('CourseList');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageCourses')}>
            <i className="bi-journal-medical"></i> Manage Courses
        </button>
    );

    // fetch existing courses  
    const fetchCourses = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(`${API_BASE_URL}/academy/courses/`, config);
            setCourses(response.data);
        } catch (error) {
            setError(' Failed to fetch courses list.');
            console.error(error);
        }
    };
    useEffect(() => {
        setError('');
        if (courses.length === 0) {
            fetchCourses();
        }

    }, []);


    // fetch programs for select 
    const fetchPrograms = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get(`${API_BASE_URL}/academy/programs/`, config);
            setPrograms(response.data);
        } catch (error) {
            setError(' Failed to fetch programs/courses list.');
            console.error(error);
        }
    };
    useEffect(() => {
        setError('');
        if (programs.length === 0) {
            fetchPrograms();
        }

    }, []);


    // show details when a course is selected from list 
    const courseDetail = (course) => {
        setSelectedCourse(course);
        setShowComponent('CourseDetails')
    }

    const reloadCourses = () => {
        fetchCourses();
    }

    const renderComponent = () => {
        switch (showComponent) {
            case 'CourseList':
                return <CourseList courseDetail={courseDetail} programs={programs} />;
            case 'AddCourse':
                return <AddCourse programs={programs} courses={courses} reloadCourses={reloadCourses} />;
            case 'CourseDetails':
                return <CourseDetail viewCourse={selectedCourse} programs={programs} courses={courses} />;
            default:
                return <CourseList courseDetail={courseDetail} programs={programs} />;
        }
    }


    return (
        <>
            <div className="">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {updatedBreadcrumb.map((item, index) => (
                            <li className="breadcrumb-item" key={index}>{item}</li>
                        ))}
                    </ol>
                </nav>

            </div>

            <h2 className="text-center m-5 px-2 font-merriweather">Manage Courses</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'CourseList'}
                    onClick={() => setShowComponent('CourseList')}>
                    List All Courses
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddCourse'}
                    onClick={() => setShowComponent('AddCourse')}>
                    Add New Course
                </button>
            </nav>

            <div className="">
                {error && (
                    <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                        <i className="bi bi-x-octagon-fill"> </i>
                        <strong> {error} </strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                    </div>
                )}

                {renderComponent()}
            </div>
        </>
    );
}



const AddCourse = ({ courses, programs, reloadCourses }) => {
    const accessToken = getAccessToken();
    const form = {
        name: '',
        acronym: '',
        code: '',
        credit: '',
        prerequisites: [],
        programs: [],
    }
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState(form);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);


    // structure program options for select (pkg: react-select)
    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.name}`
    }));

    // structure course options for select (pkg: react-select)
    const courseOptions = courses.map(course => ({
        value: course.id,
        label: `${course.acronym} ${course.code} - ${course.name}`
    }));

    
    // handle program select 
    const handleProgramChange = (selectedOptions) => {
        setSelectedPrograms(selectedOptions);
        const programIds = selectedOptions.map(program => program.value);
        setFormData({ ...formData, programs: programIds });
    };

    // handle course select 
    const handleCourseChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
        const courseIds = selectedOptions.map(course => course.value);
        setFormData({ ...formData, prerequisites: courseIds });
    };

    // handle other inputs 
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // reset form to initial data 
    const resetForm = () => {
        setFormData(form);
        setSelectedCourses([]);
        setSelectedPrograms([]);
    }

    // submit data to api to create a new course
    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/academy/courses/`, formData, config);
            // clear form
            resetForm();
            setMessage('Course added successfully.');
            setError('');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessages = Object.entries(error.response.data)
                    .flatMap(([key, errorArray]) => {
                        if (Array.isArray(errorArray)) {
                            return errorArray.map(error => `[${key}] ${error}`);
                        } else if (typeof errorArray === 'object') {
                            const errorMessage = Object.values(errorArray).join(' ');
                            return [`[${key}] ${errorMessage}`];
                        } else {
                            return [`[${key}] ${errorArray}`];
                        }
                    })
                    .join('\n');

                if (errorMessages) {
                    setError(`Error creating Course. \n${errorMessages}`);
                } else {
                    setError('Error creating Course. Please try again.');
                }
            } else {
                setError('Error creating Course. Please try again.');
            }
            setMessage('');
            console.error('Error creating Course:', error);
        }
    };

    // update newly added course in select input for Prerequisites 
    const reloadPrerequisites = (
        <>
            <button type='button' className='btn btn-light text-secondary d-inline p-0 px-1 m-1' onClick={reloadCourses}>
                <small>
                    <i className="bi bi-arrow-clockwise"> </i>
                    Reload
                </small>
            </button>
        </>
    );


    return (
        <div>

            {message && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {message} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMessage('')}></button>
                </div>
            )}

            {/* show api error response  */}
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="d-flex">

                {/* course form  */}
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Course name:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Acronym:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="acronym"
                                value={formData.acronym}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Code:</label>
                            <input
                                type="number"
                                className="form-control"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Credit: </label>
                            <input
                                type="number"
                                className="form-control"
                                name="credit"
                                value={formData.credit}
                                onChange={handleInputChange}
                                placeholder='e.g. 3'
                                required
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">Select Prerequisites: </label>
                            {reloadPrerequisites}
                            <Select
                                options={courseOptions}
                                isMulti
                                value={selectedCourses}
                                onChange={handleCourseChange}
                            />
                        </div>
                        <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                            <label className="text-secondary py-1">For which program(s): </label>
                            <Select
                                options={programOptions}
                                isMulti
                                value={selectedPrograms}
                                onChange={handleProgramChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-darkblue2 mx-auto m-4 d-flex">Add Course</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </form>
            </div>
        </div>
    );
};


const CourseList = ({ courseDetail }) => {
    const accessToken = getAccessToken();
    const [courses, setCourses] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState('');


    // get existing courses from api 
    const fetchCourses = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.get(`${API_BASE_URL}/academy/courses/`, config);
            setCourses(response.data);
        } catch (error) {
            setError(' Failed to fetch courses list.');
            console.error('Error fetching courses:', error);
        }
    };
    useEffect(() => {
        fetchCourses();
    }, []);


    // set all courses as initial filtered data, used for searching  
    useEffect(() => {
        setFilteredData(courses);
    }, [courses]);


    // show details when a course is selected 
    const handleCourseClick = (course) => {
        courseDetail(course);
    };


    // check if there prerequisites 
    const hasPrerequisites = (prerequisites) => {
        return (prerequisites.length > 0) ? 'Yes' : 'No';
    }


    // set course list or data table column data  
    const columns = [
        {
            name: 'Code',
            selector: (row) => `${row.acronym} - ${row.code}`,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            width: '40%',
        },
        {
            name: 'Credit',
            selector: (row) => row.credit,
            sortable: true,
        },
        {
            name: 'Prerequisites',
            selector: (row) => hasPrerequisites(row.prerequisites),
            sortable: true,
        },
        {
            name: 'Actions',
            button: true,
            cell: (row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-outline-dark me-2 border-0"
                    onClick={() => handleCourseClick(row)}
                >
                    Details
                </button>
            ),
        },
    ];

    // define data table column styles 
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


    // handle course search 
    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = courses.filter(
            (course) =>
                hasPrerequisites(course.prerequisites).toLowerCase().includes(keyword) ||
                course.name.toLowerCase().includes(keyword) ||
                course.acronym.toLowerCase().includes(keyword) ||
                course.credit.toString().toLowerCase().includes(keyword) ||
                course.code.toString().toLowerCase().includes(keyword)
        );
        setFilteredData(filteredResults);
    };


    // get and memorize all courses, use in export pdf for efficiency 
    const tableData = useMemo(() => {
        // Sort the filteredData by `${course.acronym} - ${course.code}`. using "comparator-based sorting" 
        const sortedData = [...filteredData].sort((a, b) => {
            const nameA = `${a.acronym} - ${a.code}`.toUpperCase();
            const nameB = `${b.acronym} - ${b.code}`.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        return sortedData.map((course) => [
            `${course.acronym} - ${course.code}`,
            course.name,
            course.credit,
            hasPrerequisites(course.prerequisites),
        ]);
    }, [filteredData]);

    // export courses as PDF using jsPDF 
    const exportPDF = () => {
        const doc = new jsPDF();

        const headline = 'Course List';

        const headers = [['Code', 'Name', 'Credit', 'Prerequisites']];
        const headerStyles = {
            fillColor: [1, 1, 50],
            textColor: [238, 212, 132],
            lineWidth: 0.1,
        };

        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getStringUnitWidth(headline) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        const textY = 15;

        doc.setFontSize(16);
        doc.text(headline, textX, textY);

        const tableStartY = doc.internal.getFontSize() + 10;
        const tableEndY = doc.autoTable.previous.finalY;

        doc.autoTable({
            startY: tableStartY,
            head: headers,
            body: tableData,
            didDrawCell: (data) => {
                // Empty didDrawCell to not override styles
            },
            headStyles: headerStyles,
        });

        doc.save('course_list.pdf');
    };


    return (
        <div>
            {error && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {error} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="mb-3 me-5 input-group">
                <label htmlFor="filter" className="d-flex me-2 ms-auto p-1">
                    Filter:
                </label>
                <select id="filter" className="rounded bg-darkblue text-beige p-1" onChange={handleSearch}>
                    <option value="">No Filter</option>
                    <option value="Yes">Has Prerequisites</option>
                    <option value="No">No Prerequisites</option>
                    <option value="Lab">Lab Courses</option>
                </select>
            </div>

            {/* search field  */}
            <div className="my-5 mx-md-5">
                <input
                    type="text"
                    placeholder="Search ..."
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            {/* datatable component for listing  */}
            <div className="rounded-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    highlightOnHover
                />
            </div>

            {/* export buttons  */}
            <div className="d-flex justify-content-center my-5">
                <CSVLink
                    data={filteredData}
                    filename="course_list.csv"
                    className="btn btn-sm btn-darkblue me-3"
                >
                    <i className="bi bi-filetype-csv px-1"></i>
                    Export as CSV
                </CSVLink>
                <button className="btn btn-sm btn-darkblue" onClick={exportPDF}>
                    <i className="bi bi-file-pdf px-1"></i>
                    Export as PDF
                </button>
            </div>

        </div>
    );
};


const CourseDetail = ({ viewCourse, programs, courses }) => {
    const accessToken = getAccessToken();
    const [formData, setFormData] = useState(viewCourse);
    const [isEditing, setIsEditing] = useState(false);
    const [deactive, setDeactive] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [failedMessage, setFailedMessage] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedPrograms, setSelectedPrograms] = useState([]);


    // structure program options for select (pkg: react-select)
    const programOptions = programs.map(program => ({
        value: program.id,
        label: `${program.acronym} ${program.code} - ${program.name}`
    }));

    // structure course options for select (pkg: react-select)
    const courseOptions = courses.map(c => ({
        value: c.id,
        label: `${c.acronym} ${c.code} - ${c.name}`,
        isDisabled: viewCourse && viewCourse.id === c.id
    }));


    // set initial course details on load 
    const setDetails = () => {
        // Set details from ids of prerequisite courses and related programs of the selected course. 

        const filteredPrerequisites = courseOptions.filter(courseOption => viewCourse.prerequisites.includes(courseOption.value));
        setSelectedCourses(filteredPrerequisites);

        const filteredPrograms = programOptions.filter(programOption => viewCourse.programs.includes(programOption.value));
        setSelectedPrograms(filteredPrograms);
    }
    useEffect(() => {
        setDetails();
    }, [])

    // reset to initials data
    const resetForm = () => {
        setFormData(viewCourse);
        setDetails();
    }


    // handle program select 
    const handleProgramChange = (selectedOptions) => {
        setSelectedPrograms(selectedOptions);
        const programIds = selectedOptions.map(program => program.value);
        setFormData({ ...formData, programs: programIds });
    };

    // handle course select 
    const handleCourseChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
        const courseIds = selectedOptions.map(course => course.value);
        setFormData({ ...formData, prerequisites: courseIds });
    };

    // handle other inputs 
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // enable or disable form inputs 
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setSuccessMessage('');
        setFailedMessage('');
    };

    // update request handler, communicate with api 
    const handleUpdate = async () => {
        setSuccessMessage('');
        setFailedMessage('');
        if (JSON.stringify(viewCourse) === JSON.stringify(formData)) {
            setFailedMessage('No changes to update.');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };
            await axios.patch(`${API_BASE_URL}/academy/courses/${viewCourse.id}/`, formData, config);
            setIsEditing(false);
            setDeactive(true);
            setSuccessMessage('Course updated successfully.');
        } catch (error) {
            setFailedMessage('Course update failed. Please try again later.');
            console.error('Error updating course:', error);
        }
    };
    
    // delete request handler, communicate with api 
    const handleDelete = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            await axios.delete(`${API_BASE_URL}/academy/courses/${viewCourse.id}/`, config);
            setSuccessMessage('Course deleted successfully.');
            setDeactive(true);
            setIsDelete(false);
            setIsEditing(false);
        } catch (error) {
            setFailedMessage('Course deletion failed. Please try again later.');
            console.error('Error deleting course:', error);
        }
    };


    return (
        <div className='mb-5 pb-5'>

            {/* headings  */}
            <h2 className='text-center font-merriweather'>
                <span className="badge bg-white p-2 fw-normal text-secondary fs-6 border border-beige">Course Detail</span>
            </h2>

            {/* edit or delete buttons  */}
            <div className='d-flex'>
                <button type="button" disabled={deactive} className="btn btn-darkblue2 ms-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={handleEditToggle}><i className='bi bi-pen'></i></button>
                <button type="button" disabled={deactive} className="btn btn-danger me-auto rounded-circle p-3 mb-3 mx-1 lh-1" onClick={() => setIsDelete(!isDelete)}><i className='bi bi-trash'></i></button>
            </div>

            {/* delete confirmation  */}
            {isDelete &&
                <div className="container d-flex align-items-center justify-content-center">
                    <div className="alert alert-info" role="alert">
                        <div className="btn-group text-center mx-auto" role="group" aria-label="Basic outlined example">
                            <h6 className='text-center me-4 my-auto'>Are  you sure to DELETE this course?</h6>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}> Yes </button>
                            <button type="button" className="btn btn-success ms-2" onClick={() => setIsDelete(!isDelete)}> No </button>
                        </div>
                    </div>
                </div>}

            {/* api request success response message  */}
            {successMessage && (
                <div className={`alert alert-success alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-check-circle-fill"> </i>
                    <strong> {successMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSuccessMessage('')}></button>
                </div>
            )}

            {/* api request fail response message  */}
            {failedMessage && (
                <div className={`alert alert-danger alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
                    <i className="bi bi-x-octagon-fill"> </i>
                    <strong> {failedMessage} </strong>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setFailedMessage('')}></button>
                </div>
            )}

            {/* course form  */}
            <form>
                <div className='row'>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Course name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Acronym:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="acronym"
                            value={formData.acronym}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Code:</label>
                        <input
                            type="number"
                            className="form-control"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Credit: </label>
                        <input
                            type="number"
                            className="form-control"
                            name="credit"
                            value={formData.credit}
                            onChange={handleInputChange}
                            placeholder='e.g. 3'
                            disabled={!isEditing}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">Select Prerequisites: </label>
                        <Select
                            options={courseOptions}
                            isMulti
                            value={selectedCourses}
                            onChange={handleCourseChange}
                            isDisabled={!isEditing}
                        />
                    </div>
                    <div className=" col-sm-12 col-md-8 my-2  mx-auto">
                        <label className="text-secondary py-1">For which program(s): </label>
                        <Select
                            options={programOptions}
                            isMulti
                            value={selectedPrograms}
                            onChange={handleProgramChange}
                            isDisabled={!isEditing}
                        />
                    </div>
                </div>
                {isEditing && <>
                    <button type="button" className="btn btn-darkblue2 mx-auto m-4 d-flex" onClick={handleUpdate}>Update</button>
                    <button type="button" className="btn btn-dark mx-auto m-4 btn-sm d-flex" onClick={resetForm}>Reset</button>
                </>}
            </form>
        </div>
    );
};





export default ManageCourses;
