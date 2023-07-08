/**
 * Calling from: Activity.jsx
 * Calling to: 
 */


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageDegreeTypes = ({ setActiveComponent, breadcrumb }) => {
    const [showComponent, setShowComponent] = useState('DegreeTypeList');
    const [selectedDegreeType, setSelectedDegreeType] = useState('');

    const updatedBreadcrumb = breadcrumb.concat(
        <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageDegreeTypes')}>
            <i className="bi-mortarboard-fill"></i> Manage Degree Types
        </button>
    );

    const renderComponent = () => {
        switch (showComponent) {
            case 'DegreeTypeList':
                return <DegreeTypeList setSelectedDegreeType={setSelectedDegreeType} setShowComponent={setShowComponent} />;
            case 'AddDegreeType':
                return <AddDegreeType />;
            case 'EditDegreeType':
                return <EditDegreeType institute={selectedDegreeType} setShowComponent={setShowComponent} />;
            default:
                return <DegreeTypeList setSelectedDegreeType={setSelectedDegreeType} setShowComponent={setShowComponent} />;
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

            <h2 className="text-center m-5 px-2">Manage DegreeTypes</h2>

            <nav className="nav nav-pills flex-column flex-sm-row my-4">
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'DegreeTypeList'}
                    onClick={() => setShowComponent('DegreeTypeList')}>
                    List All DegreeTypes
                </button>
                <button
                    className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                    disabled={showComponent === 'AddDegreeType'}
                    onClick={() => setShowComponent('AddDegreeType')}>
                    Add New Degree Type
                </button>
            </nav>

            <div className="">
                {renderComponent()}
            </div>
        </>
    );
}


const DegreeTypeList = ({ setSelectedDegreeType, setShowComponent }) => {

}


const AddDegreeType = () => {

}


const EditDegreeType = () => {

}





export default ManageDegreeTypes;