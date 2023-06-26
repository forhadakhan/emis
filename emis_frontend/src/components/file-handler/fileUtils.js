// fileUtils.js

import { API_BASE_URL } from '../../utils/config';
import axios from 'axios';


export const deleteFile = async (file_id) => {
    const url = `${API_BASE_URL}/file/delete/`;

    try {
        await axios.delete(url, { data: { file_id } });
        return true; // Deletion successful
    } catch (error) {
        console.error('Error deleting file:', error);
        return false; // Deletion failed
    }
};
