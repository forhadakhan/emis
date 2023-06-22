/**
 * Calling From:  ManageAdministrator.jsx; ManageStaff.jsx; 
 * Calling To: DataTable  
 */


import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../../../index.css';


const DataTableList = ({ source, setReference,  setActiveComponent }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setData(source);
    }, [source]);

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
            name: 'Username',
            selector: 'fields.username',
            sortable: true,
            style: {
                textTransform: 'uppercase',
            },
        },
        {
            name: 'First Name',
            selector: 'fields.first_name',
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: 'fields.last_name',
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'fields.email',
            sortable: true,
        },
        {
            name: 'Profile',
            cell: (row) => (
                <div className='mx-auto'>
                    <button type="button" className="btn btn-outline-dark me-2" onClick={() => handleClick(row.pk)}>
                        <i className="bi bi-eye-fill fs-5"></i>
                    </button>
                    {/* {!row.fields.is_active && <i className="bi bi-slash-square"></i>} */}
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


    const handleClick = (pk) => {
        setReference(pk)
        setActiveComponent("ManageProfile");
    };

    return (
        <div>
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center"
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

