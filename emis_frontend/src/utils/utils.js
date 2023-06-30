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
