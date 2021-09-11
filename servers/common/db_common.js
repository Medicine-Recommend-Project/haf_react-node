//console 창에 결과 출력하게 해주는 것
exports.result = (sql, result = "-") =>{
    return logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

//Query문과 data를 합쳐주는 함수
exports.formatQuery = (connection, query, data = null) =>{
    return connection.format(query, data);
}

//INSERT 쿼리문의 ?를 필요한 column의 수만큼 배열로 돌려주는 함수
exports.makingInsertQuestionMark = (column, options = null) =>{
    let makeQuestionMark = column.reduce((array, column) =>{
            if(options && options.column === column) array.push(options.value);
            else array.push("?");
        return array;
    },[]);

    return makeQuestionMark;
}
//UPDATE 쿼리문의 ?를 필요한 column의 수만큼 배열로 돌려주는 함수
exports.makingUpdateQuestionMark = (column) =>{
    let makeQuestionMark = column.reduce((array, column) =>{
        array.push(column + " = ? ");
        return array;
    },[]);

    return makeQuestionMark;
}