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

// Function to save the user profile data in localStorage
export const setProfileData = (profile) => {
    // Check if 'profile' has 'permission_groups' and 'permissions' properties
    if (profile.hasOwnProperty('permission_groups') && profile.hasOwnProperty('permissions')) {
        // Merge 'profile.permissions' and 'profile.permission_groups.permissions' into a new array
        const allPermissions = [...profile.permissions, ...profile.permission_groups.reduce((acc, group) => acc.concat(group.permissions), [])];

        // Filter distinct elements based on the 'id' property
        const permissions = allPermissions.filter((permission, index, self) =>
            self.findIndex(p => p.id === permission.id) === index
        );

        // Encrypt and store the updated 'profile' object in localStorage
        const encryptedUserPermissions = encryptData(JSON.stringify(permissions));
        localStorage.setItem('permissions', encryptedUserPermissions);
    }
    // Encrypt and store the original 'profile' object in localStorage
    const encryptedUserProfile = encryptData(JSON.stringify(profile));
    localStorage.setItem('profile', encryptedUserProfile);
};


// Function to check if logged user has a permission
export const hasPermission = (codename) => {
    // Retrieve stored permissions from localStorage
    const encryptedPermissions = localStorage.getItem('permissions');

    // Check if permissions are stored
    if (!encryptedPermissions) {
        return false;
    }

    // Decrypt retrieved encryptedPermissions 
    const decryptedPermissions = decryptData(encryptedPermissions);
    const storedPermissions = JSON.parse(decryptedPermissions);

    // Check if the passed codename exists in stored permissions
    return storedPermissions.some((permission) => permission.codename === codename);
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

// Function to get the user profile data from localStorage
export const getProfileData = () => {
    const encryptedUser = localStorage.getItem('profile');
    if (encryptedUser) {
        const user = JSON.parse(decryptData(encryptedUser));
        return user;
    }
    return null;
};

// set enrollment data
const setEnrollmentData = async (userRole, profileId) => {
    // fetch enrollment data
    try {
        const accessToken = getAccessToken();
        const profile = userRole === 'student' ? 'students' : 'other-profile'; 

        const response = await axios.get(
            `${API_BASE_URL}/academy/${profile}/${profileId}/enrollment/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = response.data;
        // Encrypt and store the enrollment data in localStorage
        const encryptedData = encryptData(JSON.stringify(data));
        localStorage.setItem('enrollment', encryptedData);
    } catch (error) {
        // localStorage.setItem('enrollment', '');
        // console.error('Error fetching enrollment data:', error);
    }
}

// Function to get the enrollment data from localStorage
export const getEnrollmentData = () => {
    const encryptedData = localStorage.getItem('enrollment');
    if (encryptedData) {
        const data = JSON.parse(decryptData(encryptedData));
        return data;
    }
    return '';
};


// Function to save the login response data
export const saveLoginResponse = (data) => {
    // console.log(data);
    // Save the access token in localStorage
    const { access } = data;
    setAccessToken(access);

    // Save the refresh token in localStorage
    const { refresh } = data;
    setRefreshToken(refresh);

    // Save the user data (if needed)
    const { user } = data;
    setUserData(user);

    // Save the user data (if needed)
    if (data.profile) {
        const { profile } = data;
        setProfileData(profile);
        if(user.role === 'student' || user.role === 'teacher') {
            setEnrollmentData(user.role, profile.id)
        }
    } else {
        const profile = '';
        setProfileData(profile);
    }
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


export const getFileLink = (file_id) => {
    return `https://drive.google.com/uc?export=view&id=${file_id}`
}

export const getFileLink2 = (file_id) => {
    return `https://drive.google.com/file/d/${file_id}/view`
}