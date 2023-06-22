/**
 * Calling From: 
 * Calling To: GeneralZone.jsx; AdditionalStaffZone.jsx; DangerZone.jsx;  
 */

import React from 'react';
import DangerZone from './DangerZone';
import AdditionalStaffZone from './AdditionalStaffZone';
import GeneralZone from './GeneralZone';


const StaffSettings = () => {
    return (
        <div className="container rounded mt-5 mb-5">

            <GeneralZone />
            <AdditionalStaffZone /> 
            <DangerZone />

        </div>
    );
};

export default StaffSettings;
