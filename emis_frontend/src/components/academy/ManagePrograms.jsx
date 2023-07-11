/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth.js';

const ManagePrograms = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('ProgramList');
    const [selectedProgram, setSelectedProgram] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManagePrograms')}>
            <i className="bi bi-mortarboard"></i> Manage Programs
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'ProgramList':
                return <ProgramList setSelectedProgram={setSelectedProgram} setShowComponent={setShowComponent} />;
            case 'AddProgram':
                return <AddProgram />;
            case 'ProgramDetails':
                return <ProgramDetail program={selectedProgram} setShowComponent={setShowComponent} />;
            default:
                return <ProgramList />;
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

            <h2 className="text-center m-5 px-2">Manage Programs</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'ProgramList'}
                    onClick={() => setShowComponent('ProgramList')}>
                    List All Programs
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddProgram'}
                    onClick={() => setShowComponent('AddProgram')}>
                    Add New Program
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


const AddProgram = () => {
    
};


const ProgramList = () => {

};


const ProgramDetail = ({ program }) => {
    
};


export default ManagePrograms;
