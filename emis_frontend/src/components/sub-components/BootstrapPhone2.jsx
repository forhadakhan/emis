

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
import 'react-phone-input-2/lib/bootstrap.css';

const BootstrapPhone = ({ value, onChange, setIsPhoneValid, disabled }) => {
    const [phoneError, setPhoneError] = useState(false)
    const validatePhoneNumber = (input) => {
        const phone = '+'+input;
        // only validate Bangladeshi numbers 
        if (phone.startsWith('+880') || phone.startsWith('880') || phone.startsWith('0')) {
            const pattern = /^(?:\+?880|0|88)?\s?1[3456789]\d{8}$/;
            if (!pattern.test(phone)) {
                setPhoneError(true);
                setIsPhoneValid(false);
            } else {
                setPhoneError(false);
                setIsPhoneValid(true);
            }
            onChange(phone);
        } else{
            setPhoneError(false);
            setIsPhoneValid(true);
        }
    };

    return (
        <div
            className="input-group"
            style={{
                maxWidth: "400px",                
            }}
        >
            <PhoneInput
                country={"bd"}
                value={value}
                onChange={(phone) => validatePhoneNumber(phone)}
                disabled={disabled} 
            />
            {phoneError && <div>
                <p className="text-danger small">Invalid. Please input a valid Bangladeshi number.</p>
            </div>}
        </div>
    );
};

export default BootstrapPhone;
