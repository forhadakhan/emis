import React from 'react';
import { getUserData, getProfileData } from '../auth';
import ViewProfile from './profile/ViewProfile';

const ProfileComponent = ({ componentController }) => {

    const user = getUserData();
    const profile = getProfileData();

    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue"><i className="bi bi-person"></i></h2>
            
            <ViewProfile user={user} profile={profile} componentController={componentController} />

        </div>
    );
};

export default ProfileComponent;
