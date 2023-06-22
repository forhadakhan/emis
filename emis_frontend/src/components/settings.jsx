import React, { useState } from 'react';
import StaffSettings from './settings/StaffSettings';


const SettingsComponent = () => {


    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue">
                <i className="bi bi-gear-fill"></i>
            </h2>

            <StaffSettings />
        </div>
    );
};

export default SettingsComponent;
