import React, { useState, useEffect } from 'react';
import AddUser from './add-user/AddUser';
import AddAdministrator from './add-user/AddAdministrator';
import AddStaff from './add-user/AddStaff';
import AddTeacher from './add-user/AddTeacher';
import AddStudent from './add-user/AddStudent';
import ManageUser from './manage-user/ManageUser';
import ManageAdministrator from './manage-user/ManageAdministrator';
import ManageStaff from './manage-user/ManageStaff';
import ManageTeacher from './manage-user/ManageTeacher';
import ManageStudent from './manage-user/ManageStudent';


const ActivityComponent = () => {
    const [activeComponent, setActiveComponent] = useState('main');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'main':
                return <ActivityPanel setActiveComponent={setActiveComponent} />;
            case 'AddAdministrator':
                return <AddAdministrator setActiveComponent={setActiveComponent} />;
            case 'AddStaff':
                return <AddStaff setActiveComponent={setActiveComponent} />;
            case 'AddTeacher':
                return <AddTeacher setActiveComponent={setActiveComponent} />;
            case 'AddStudent':
                return <AddStudent setActiveComponent={setActiveComponent} />;
            case 'ManageAdministrator':
                return <ManageAdministrator setActiveComponent={setActiveComponent} />;
            case 'ManageStaff':
                return <ManageStaff setActiveComponent={setActiveComponent} />;
            case 'ManageTeacher':
                return <ManageTeacher setActiveComponent={setActiveComponent} />;
            case 'ManageStudent':
                return <ManageStudent setActiveComponent={setActiveComponent} />;
            default:
                return (
                    <div>Looks like the rendering component in "activity" is having a wild party and forgot its job description!</div>
                );
        }
    };

    return (
        <div>
            <div className="container">
                <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue">
                    <button className="border-0 bg-transparent" onClick={() => setActiveComponent('main')}><i className="bi bi-grid-fill text-center fs-4 d-block"></i></button>
                </h2>
                {/* Render activeComponent */}
                {renderComponent()}
            </div>
        </div>
    );
};

const ActivityPanel = ({ setActiveComponent }) => {
    return (
        <div>
            <AddUser setActiveComponent={setActiveComponent} />
            <ManageUser setActiveComponent={setActiveComponent} />
        </div>
    );
};




export default ActivityComponent;
