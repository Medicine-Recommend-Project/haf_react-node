//console 창에 결과 출력하게 해주는 것
exports.result = (sql, result = "-") =>{
    return logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}
//예외 처리 한번에 하려고 하는건데 되려나...
exports.exceptionHandling = (codes) =>{
    return
    try{
        codes()
    }catch (e) {
        logger.error(e)
    }finally {

    }
}