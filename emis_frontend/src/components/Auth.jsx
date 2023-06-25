/**
 * Calling from: 
 *              Welcome.jsx 
 * Calling to: 
 *              Login.jsx 
 *              ResendVerificationEmail.jsx 
 *              ResetPassword.jsx
 */

import React, {useState} from 'react';
import Logo256 from '../assets/logos/emis-256x256.png';
import LoginComponent from './auth/login';
import ResendVerificationEmail from './auth/ResendVerificationEmail';
import ResetPassword from './auth/ResetPassword';


const AuthHandler = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [activeAuthComponet, setActiveAuthComponet] = useState('');

    const renderComponent = () => {
        switch (activeAuthComponet) {
            case 'ResendVerificationEmail':
                return <ResendVerificationEmail username={username} setUsername={setUsername} setActiveAuthComponet={setActiveAuthComponet} />;
            case 'ResetPassword':
                return <ResetPassword username={username} setUsername={setUsername} setActiveAuthComponet={setActiveAuthComponet} />;
            case 'LoginComponent':
                return <LoginComponent username={username} setUsername={setUsername} setActiveAuthComponet={setActiveAuthComponet} onLoginSuccess={onLoginSuccess} />;
            default:
                return (
                    <LoginComponent username={username} setUsername={setUsername} setActiveAuthComponet={setActiveAuthComponet} onLoginSuccess={onLoginSuccess} />
                );
        }
    }; 

    return (
        <div>
            {renderComponent()}
        </div>
    );
};

export default AuthHandler;
