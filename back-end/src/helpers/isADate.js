function isADate(dateString){
    const regexp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    return regexp.test(dateString);
};


module.exports = isADate;