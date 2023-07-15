// src/utils/config.js


export const formatDateTime = (dateTimeString, timeZone = "Asia/Dhaka") => {
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


export const getOrdinal = (number) => {
    /**
     * Take a number and return ordinal. for example: 
     * input: 2     output: 2nd 
     * input: 44     output: 44th
     */
    const parsedNumber = parseInt(number, 10);

    if (isNaN(parsedNumber)) {
        //   throw new Error('Input should be a valid number.');
        return NaN;
    }

    const suffixes = ['th', 'st', 'nd', 'rd'];
    const absNumber = Math.abs(parsedNumber);
    const lastDigit = absNumber % 10;
    const suffix = suffixes[lastDigit] || suffixes[0];

    return parsedNumber + suffix;
}
