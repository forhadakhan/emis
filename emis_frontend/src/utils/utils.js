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
  

export const getCurrentDateTimeInSingleStr = () => {
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

