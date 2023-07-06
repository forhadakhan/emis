/**
 * Calling from: Activity.jsx
 * Calling to: 
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageTeacherDesignations = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('DesignationList');


    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTeacherDesignations')}>
            <i className="bi bi-person-fill-up"></i> Manage Teacher Designations
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'DesignationList':
                return <DesignationList />
            case 'AddDesignation':
                return <AddDesignation />
            default:
                return <DesignationList />
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
            <h2 className="mt-2 px-2">Manage Teacher Designations</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button 
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`} 
                    disabled={showComponent==='DesignationList'}
                    onClick={() => setShowComponent('DesignationList')}>
                        List All Designations
                </button>
                <button 
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`} 
                    disabled={showComponent==='AddDesignation'}
                    onClick={() => setShowComponent('AddDesignation')}>
                        Add New Designation
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



export const DesignationList = () => {
    const [designations, setDesignations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const accessToken = getAccessToken();

    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/designations/`, config);
                setDesignations(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDesignations();
    }, []);

    useEffect(() => {
        setFilteredData(designations.filter(designation => designation.name.toLowerCase().includes(searchKeyword.toLowerCase())));
    }, [designations, searchKeyword]);

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (<>
                <div className="mx-auto">
                    <button
                        type="button"
                        className="btn border-0 btn-outline-primary p-1 mx-1"
                        onClick={() => handleEditModal(row)}>
                        <i className="bi bi-pen"></i> 
                    </button>
                    <button
                        type="button"
                        className="btn border-0 btn-outline-danger p-1 mx-1"
                        onClick={() => handleDeleteModal(row)}>
                        <i className="bi bi-trash"></i> 
                    </button>
                </div>
            </>),
            button: true
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
                fontSize: '16px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '8px',
                fontSize: '19px',
                backgroundColor: 'rgb(1, 1, 50)',
                color: 'rgb(238, 212, 132)',
                border: '1px solid rgb(238, 212, 132)',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '8px',
                fontWeight: 'bold',
            },
        },
    };

    return (
        <div>
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                    className="form-control text-center border border-darkblue"
                />
            </div>

            <div className="rounded-top-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};



const AddDesignation = () => {
    const [name, setName] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const accessToken = getAccessToken();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };
  
        const newDesignation = { name };
        const response = await axios.post(`${API_BASE_URL}/academy/designations/`, newDesignation, config);
        setAlertMessage('Designation added successfully');
        setAlertType('success');
          
        // Clear the form
        setName('');
      } catch (error) {
        setAlertMessage('Failed to add designation');
        setAlertType('danger');
        console.error(error);
      }
    };

  return (
    <div className="container">
        
      <form onSubmit={handleSubmit}>
        <div className="mb-3 col-sm-12 col-md-6 mx-auto">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-darkblue p-1 px-2 d-flex mx-auto" disabled={name.length < 2}>Add Designation</button>
      </form>

      {alertMessage && (
        <div className={`alert alert-${alertType} alert-dismissible fade show mt-3 col-sm-12 col-md-6 mx-auto`} role="alert">
            <i className={`bi ${alertType==='success' ? 'bi-check-circle-fill' : 'bi-x-circle'} mx-2`}></i>
            <strong>{alertMessage}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setAlertMessage('')}></button>
        </div>
      )}

    </div>
  );
};



export default ManageTeacherDesignations;