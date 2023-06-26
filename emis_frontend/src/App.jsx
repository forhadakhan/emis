import React, { useState, useEffect } from 'react';
import './App.css';
import WelcomePage from './components/Welcome';
import LandingComponent from './components/landing';
import Logo256 from './assets/logos/emis-256x256.png';
import { getAccessToken, checkTokenValidity, refreshTokens } from './utils/auth.js';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        handleAppLoad();
    }, []);

    const handleAppLoad = async () => {
        const accessToken = getAccessToken();
        if (accessToken) {
            const isValid = await checkTokenValidity(accessToken);
            if (!isValid) {
                const newAccessToken = await refreshTokens();
                if (newAccessToken) {
                    // Tokens refreshed successfully
                    // New access token received
                    setIsLoggedIn(true);
                } else {
                    // Error refreshing tokens
                    // As access or refresh token can't be validated:
                    setIsLoggedIn(false);
                }
            } else {
                // Access token is valid
                setIsLoggedIn(true);
            }
        }
        setIsLoading(false); // App has finished loading
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogoutSuccess = (response) => {
        setIsLoggedIn(false);
    };

    if (isLoading) {
        // Show logo while loading page
        return (
            <div className="d-flex align-items-center justify-content-center vh-100">
                <img src={Logo256} alt="EMIS Logo" />
            </div>
        );
    }

    return (
        <div className='vh-100'>
            
            {isLoggedIn ? (
                <LandingComponent onLogoutSuccess={handleLogoutSuccess} />
            ) : (
                <WelcomePage onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;
