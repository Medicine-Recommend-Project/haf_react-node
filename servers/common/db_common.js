//console 창에 결과 출력하게 해주는 것
exports.result = (sql, result = "-") =>{
    return logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

//Query문과 data를 합쳐주는 함수
exports.formatQuery = (connection, query, data = null) =>{
    return connection.format(query, data);
}

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

exports.matchingBodyNColumnData = (dataList, body, options = null, otherData = null) => {
    if(!Array.isArray(dataList)) return "typeError";
    let dataArray = dataList.reduce((array, dataName)=>{
        // options 있는데 배열인데다가 options 안에 dataName이 있으면
        if(options && Array.isArray(options.dataName) && options.dataName.includes(dataName)){
            //해당하는 값을 array에 넣어준다.
            options.dataName.forEach((optionDataName, index) =>{
                optionDataName === dataName && array.push(options.value[index]);
            })
        }else if(options && options.dataName === dataName){
            //options가 있는데 배열이 아니면 단일 데이터
            array.push(options.value);
        }else if(body[dataName] !== undefined || body.dataName !== undefined){
            //options가 아닌 칭구들... 숫자 0일때도 if()문에서 걸러져서 undefined 일 때만 거르도록
            array.push( body[dataName] ?? body.dataName );
        }
        return array;
    },[]);

    if(otherData) {
        if(Array.isArray(otherData)) dataArray = dataArray.concat(otherData);
        else dataArray.push(otherData);
    }

    logger.error("최종 데이터 >>> "+dataArray);
    return dataArray;
}