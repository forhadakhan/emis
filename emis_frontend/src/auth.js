/***
    localStorage based auth using jsrsasign 
*/

import { KJUR, b64utoutf8 } from 'jsrsasign';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { API_BASE_URL } from './config';


const ENCRYPTION_KEY = 'EMIS@P400';

// Function to check if the user is logged in
export const auth_isLoggedIn = () => {
    const token = localStorage.getItem('access_token');
    return !!token;
};

// Function to clear all localStorage data
export const clearLocalStorage = () => {
    localStorage.clear();
};

// Function to log out the user
export const logout = () => {
    // Clear all localStorage data
    clearLocalStorage();
};

// Function to encrypt data
const encryptData = (data) => {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
};

// Function to decrypt data 
const decryptData = (encryptedData, encryptionKey) => {
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
    }
};

function extractUserIdFromToken(token) {
    const { payloadObj } = KJUR.jws.JWS.parse(token);
    const userId = payloadObj.id; // Assuming the user ID is stored as "userId" claim in the token

    return userId;
}



// Function to save the access token in localStorage
export const setAccessToken = (token) => {
    const encryptedToken = encryptData(token);
    localStorage.setItem('access_token', encryptedToken);
};

// Function to get the access token from localStorage
export const getAccessToken = () => {
    const encryptedToken = localStorage.getItem('access_token');
    if (encryptedToken) {
        const token = decryptData(encryptedToken);
        return token;
    }
    return null;
};

// Function to save the refresh token in localStorage
export const setRefreshToken = (token) => {
    const encryptedToken = encryptData(token);
    localStorage.setItem('refresh_token', encryptedToken);
};

// Function to get the refresh token from localStorage
export const getRefreshToken = () => {
    const encryptedToken = localStorage.getItem('refresh_token');
    if (encryptedToken) {
        const token = decryptData(encryptedToken);
        return token;
    }
    return null;
};

// Function to save the user data in localStorage
export const setUserData = (user) => {
    const encryptedUser = encryptData(JSON.stringify(user));
    localStorage.setItem('user', encryptedUser);
};

// Function to get the user data from localStorage
export const getUserData = () => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
        const user = JSON.parse(decryptData(encryptedUser));
        return user;
    }
    return null;
};

// Function to save the login response data
export const saveLoginResponse = (data) => {
    // Save the access token in localStorage
    const { access } = data;
    setAccessToken(access);

    // Save the refresh token in localStorage
    const { refresh } = data;
    setRefreshToken(refresh);

    // Save the user data (if needed)
    const { user } = data;
    setUserData(user);
};

// Function to get the user's role from the access token
export const getUserRole = () => {
    const user = getUserData();
    try {
        const role = user.role;
        return role;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
    return null;
};

// Function to get the user's role from the access token
export const getUserId = () => {
    const user = getUserData();
    try {
        const user_id = user.id;
        return user_id;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
    return null;
};


// Function to save the tokens in localStorage
export const saveTokens = (data) => {
    const { access, refresh } = data;

    // Save the new access token
    setAccessToken(access);

    // Save the new refresh token
    setRefreshToken(refresh);
};


// Function to check if the access token is still valid
export const checkTokenValidity = async () => {
    const accessToken = getAccessToken();

    if (accessToken) {
        try {
            await axios.post(`${API_BASE_URL}/token/verify/`, {
                token: accessToken,
            });

            // Access token is still valid
            return true;
        } catch (error) {
            // Access token is invalid or expired
            return false;
        }
    }

    // No access token found
    return false;
};

// Function to refresh the tokens
export const refreshTokens = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
        try {
            const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken,
            });

            // Save the new access token and refresh token
            saveTokens(response.data);

            // Tokens refreshed successfully            
            // Return the new access token
            return response.data.access;
        } catch (error) {
            // Error refreshing tokens
            return null;
        }
    }

    // No refresh token found
    return null;
};

