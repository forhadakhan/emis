import React from 'react';
import { getUserData } from '../auth';

const ProfileComponent = () => {

    const user = getUserData();
    console.log(user);

    const formatValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        } else {
            return value.toString();
        }
    };

    return (
        <div>
            <h2 className="text-center h-4 pb-4 text-darkblue border-bottom border-darkblue">Profile</h2>
            <div className="p-4 border rounded-3 bg-light mx-auto" style={{ width: '400px' }}>
                <table className="table table-hover table-light">
                    <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(user).map(([property, value]) => (
                            <tr key={property}>
                                <td className="text-end">{property} : </td>
                                <td className="text-left">{formatValue(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfileComponent;
