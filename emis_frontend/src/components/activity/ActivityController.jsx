/**
* Calling from: Landing.jsx
* Calling to: 
*/

import React from 'react';
import { getUserRole } from '../../utils/auth';

import ManagerialActivity from './ManagerialActivity';
import StudentActivity from './StudentActivity';
import TeacherActivity from './TeacherActivity';
import UnrecognizedUser from '../sub-components/UnrecognizedUser'


const ActivityController = () => {
    const userRole = getUserRole();

    const renderComponent = () => {
        switch (userRole) {
            case 'administrator':
            case 'staff':
                return <ManagerialActivity />;
            case 'teacher':
                return <TeacherActivity />;
            case 'student':
                return <StudentActivity />;
            default:
                return <UnrecognizedUser />;
        }
    }

    return (<>
        {renderComponent()}
    </>);
};


export default ActivityController;