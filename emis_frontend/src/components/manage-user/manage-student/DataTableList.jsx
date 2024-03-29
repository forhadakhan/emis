/**
 * Calling From:  StudentController.jsx; 
 * Calling To: DataTable  
 */


import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../styles/index.css';
import { getUserRole, hasPermission } from '../../../utils/auth';


const DataTableList = ({ studentUsers, setUser, setActiveComponent, setReference, hideProfile }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const isAdmin = getUserRole() === 'administrator';

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
                    {(isAdmin || hasPermission('view_student')) && !hideProfile && 
                        // view profle action button 
                        <button
                            type="button"
                            className="btn btn-outline-dark me-2 border-0"
                            onClick={() => handleProfile(row.pk)}
                            data-bs-toggle="tooltip"
                            data-bs-title="Manage Profile"
                        >
                            <i className="bi bi-eye-fill fs-5"></i>
                        </button>}
                    {(isAdmin || hasPermission('view_studentenrollment')) && 
                        // student enrollment action button 
                        <button
                            type="button"
                            className="btn btn-outline-dark me-2 border-0"
                            onClick={() => handleEnrollment(row.pk)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            data-bs-title="Manage Enrollment"
                        >
                            <i className="bi bi-person-lines-fill"></i>
                        </button>}
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

    const handleEnrollment = (teacher) => {
        setUser(teacher);
    };

    const handleProfile = (teacher) => {
        setReference(teacher);
        setActiveComponent("ManageStudentProfile");
    };

    return (
        <div>
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
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

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



export default DataTableList;

