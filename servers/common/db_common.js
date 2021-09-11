//console 창에 결과 출력하게 해주는 것
exports.result = (sql, result = "-") =>{
    return logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

//Query문과 data를 합쳐주는 함수
exports.formatQuery = (connection, query, data = null) =>{
    return connection.format(query, data);
}