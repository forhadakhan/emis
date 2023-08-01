
import axios from 'axios';
import API_BASE_URL from '../../../utils/config.js';
import { getAccessToken } from '../../../utils/auth.js';
import { getOrdinal } from '../../../utils/utils.js';



export const getBasicStudentInfo = async ({ studentData }) => {
    const enrollmentId = studentData.enrollment ? studentData.enrollment.id : '';
    let program = '';

    if (enrollmentId && !program) {
        try {
            const accessToken = getAccessToken();
            const programId = studentData.enrollment ? studentData.enrollment.batch_section.batch_data.program : '';

            const response = await axios.get(
                `${API_BASE_URL}/academy/programs/${programId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            program = response.data;
        } catch (error) {
            console.error('Error fetching program:', error);
            // Handle the error gracefully, e.g., show a message to the user or log it for debugging.
        }
    }

    const data = {
        name: `Name: ${studentData.user.first_name} ${studentData.user.middle_name} ${studentData.user.last_name}`,
        id: `ID:${studentData.user.username}`,
        programme: program
            ? `Programme: ${program.code} - ${program.degree_type.acronym} in ${program.name} (${program.acronym})`
            : '',
        batchSection: enrollmentId
            ? `Batch: ${getOrdinal(studentData.enrollment.batch_section.batch_data.number)}; Section: ${studentData.enrollment.batch_section.name}`
            : '',
        semester: enrollmentId
            ? `Current/Last Semester: ${studentData.enrollment.semester.term.name} ${studentData.enrollment.semester.year}`
            : '',
    };

    return data;
};


export default getBasicStudentInfo;
