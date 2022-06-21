function getDate(dateString, timeString) {
    const year = +dateString.substring(0, 4);
    const month = +dateString.substring(5, 7);
    const day = +dateString.substring(8, 10);
    const hour = +timeString.substring(0, 2);
    const min = +timeString.substring(3, 5);

    const date = new Date(year, month - 1, day, hour, min);
    
    return date;
}


module.exports = getDate;