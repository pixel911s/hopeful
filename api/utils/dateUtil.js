module.exports.convert = function(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
}

module.exports.convertForSqlFromDate = function(param) {
    let date = new Date(param);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

module.exports.convertForSqlToDate = function(param) {
    let date = new Date(param);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

module.exports.getDateSql = function(param) {
    let date = new Date(param);
    return date.getFullYear()+'-'+ (date.getMonth()+1)+'-'+ date.getDate();
}

module.exports.getDateTimeSql = function(param) {
    let date = new Date(param);
    return date.getFullYear()+'-'+ (date.getMonth()+1)+'-'+ date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}