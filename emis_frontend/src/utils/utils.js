// src/utils/utils.js


export const formatDateTime = (dateTimeString, timeZone = "Asia/Dhaka") => {
    /**
     *  input: 2023-07-05T21:56:21.355782Z 
     * output: July 6, 2023 at 3:56:21 AM GMT+6 
     */
    const dateTime = new Date(dateTimeString);

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: timeZone,
        timeZoneName: "short"
    };

    const formatter = new Intl.DateTimeFormat(undefined, options);
    return formatter.format(dateTime);
}


export const convertDate = (dateString) => {
    /**
     *  input: 2023-07-05T08:36:27.299326+00:00
     * output: July 5, 2023 
     */
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


export const getOrdinal = (number) => {
    /**
     * Take a number and return ordinal. for example: 
     * input: 2      output: 2nd 
     * input: 44     output: 44th
     */
    const parsedNumber = parseInt(number, 10);

    if (isNaN(parsedNumber)) {
        // throw new Error('Input should be a valid number.');
        return NaN;
    }

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const absNumber = Math.abs(parsedNumber);
    const lastTwoDigits = absNumber % 100;
    const lastDigit = absNumber % 10;
    const suffix =
        lastTwoDigits >= 11 && lastTwoDigits <= 13
            ? 'th'
            : suffixes[lastDigit] || suffixes[0];

    const ordinalNumber =
        parsedNumber < 0
            ? '-' + absNumber + suffix
            : absNumber + suffix;

    return ordinalNumber;
};


export const customDateFormat = (dateString) => {
    /**
     *  input: "2023-08-03T13:03:50.631279Z"
     * output: "3 August 2023, 7:03:50 PM"
     */

    const localDate = new Date(dateString).toLocaleString()
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date(localDate);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

    return `${day} ${month} ${year}, ${time}`;
}


export const customDateAndDayName = (dateString) => {
    /**
     *  input: 2023-10-13
     * output: 13 October 2023 (Day Name)
     */

    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const year = dateObject.getFullYear();
    const dayName = days[dateObject.getDay()];

    const formattedDate = `${day} ${month} ${year} (${dayName})`;
    return formattedDate;
};



export const getCurrentDateTimeInSingleStr = () => {
    /**
     * return current time in format: yyyymmdd-hhmmss
     */
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
    // 20230801-203557
}


export const dateShortener = (inputDate) => {
    /**
     *  input: "Sat Aug 05 2023 00:00:00 GMT+0600 (Bangladesh Standard Time)" 
     * output: "2023-08-05"
     */

    const dateObj = new Date(inputDate);

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
