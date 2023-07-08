/**
* Calling from: Activity.jsx
* Calling to: 
*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import API_BASE_URL from '../../utils/config.js';
import { getAccessToken } from '../../utils/auth';


const ManageDepartments = ({ setActiveComponent, breadcrumb }) => {
   const [showComponent, setShowComponent] = useState('DepartmentList');
   const [selectedDepartment, setSelectedDepartment] = useState('');

   const updatedBreadcrumb = breadcrumb.concat(
       <button className='btn p-0 m-0' onClick={() => setActiveComponent('ManageDepartments')}>
           <i className="bi bi-house-gear-fill"></i> Manage Departments
       </button>
   );

   const renderComponent = () => {
       switch (showComponent) {
           case 'DepartmentList':
               return <DepartmentList setSelectedDepartment={setSelectedDepartment} setShowComponent={setShowComponent} />;
           case 'AddDepartment':
               return <AddDepartment />;
           case 'DepartmentDetails':
               return <DepartmentDetails department={selectedDepartment} setShowComponent={setShowComponent} />;
           default:
               return <DepartmentList />;
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

           <h2 className="text-center m-5 px-2">Manage Departments</h2>

           <nav className="nav nav-pills flex-column flex-sm-row my-4">
               <button
                   className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                   disabled={showComponent === 'DepartmentList'}
                   onClick={() => setShowComponent('DepartmentList')}>
                   List All Departments
               </button>
               <button
                   className={`btn border flex-sm-fill text-center nav-link btn-beige m-1 p-2 fw-bold`}
                   disabled={showComponent === 'AddDepartment'}
                   onClick={() => setShowComponent('AddDepartment')}>
                   Add New Department
               </button>
           </nav>

           <div className="">
               {renderComponent()}
           </div>
       </>
   );
}



const AddDepartment = () => {

}



const DepartmentList = () => {

}



const DepartmentDetails = () => {

}






export default ManageDepartments;

