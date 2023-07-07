/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageTermChoices = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('TermList');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageTermChoices')}>
            <i className="bi-sign-intersection-fill"></i> Manage Term Choices
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'TermList':
                return <TermList />;
            default:
                return <TermList />;
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
            <h2 className="text-center m-5 px-2">Manage Term Choices</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'TermList'}
                    onClick={() => setShowComponent('TermList')}>
                    List All Terms
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddTerm'}
                    onClick={() => setShowComponent('AddTerm')}>
                    Add New Term
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}



const TermList = () => {
    const [terms, setTerms] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState('');
    const accessToken = getAccessToken();

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };

                const response = await axios.get(`${API_BASE_URL}/academy/term-choices/`, config);
                setTerms(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTerms();
    }, [accessToken]);

    useEffect(() => {
        setFilteredData(terms);
    }, [terms]);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredResults = terms.filter(
            (term) =>
                term.name.toLowerCase().includes(keyword) || 
                term.start.toLowerCase().includes(keyword) || 
                term.end.toLowerCase().includes(keyword) 
        );
        setFilteredData(filteredResults);
    };

    const handleEditModal = (term) => {
        setSelectedTerm(term);
        setShowEditModal(true);
    };

    const handleDeleteModal = (term) => {
        setSelectedTerm(term);
        setShowDeleteModal(true);
    };

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Start',
            selector: 'start',
            sortable: true,
        },
        {
            name: 'End',
            selector: 'end',
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




export default ManageTermChoices;