//console 창에 결과 출력하게 해주는 것
exports.result = (sql, result = "-") =>{
    return logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

//Query문과 data를 합쳐주는 함수
exports.formatQuery = (connection, query, data = null) =>{
    return connection.format(query, data);
}

//multi Query문과 data를 합쳐주는 함수
// exports.formatMultipleQuerySingleData = (connection, query, data = null) =>{
//     let formatString = "";
//     if(typeof query === Array){
//         query.map((singleQuery)=>{
//             formatString += connection.format(singleQuery, data);
//             return formatString;
//         });
//     }else{
//         formatString = connection.format(query, data);
//     }
//     return formatString;
// }

//배열 Query문과 2차원 배열 data를 합쳐주는 함수
exports.formatArrayQueryArrayData = (connection, query, data, singleIndex = false) =>{
    //배열을 받아왔는지 체크할 것
    if(!Array.isArray(query) || !Array.isArray(data)) return "typeError";
    let formatString = query.reduce((addString, singleQuery, index)=>{
        if(singleIndex) addString += connection.format(singleQuery, data);
        else addString += connection.format(singleQuery, data[index]);

        return addString;
    }, "");
    return formatString;
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
exports.makingUpdateQuestionMark = (column, options = null) =>{
    let makeQuestionMark = column.reduce((array, column) =>{
        if(options &&  options.column === column) array.push(column + "=" + options.value);
        else array.push(column + " = ? ");
        return array;
    },[]);

    return makeQuestionMark;
}