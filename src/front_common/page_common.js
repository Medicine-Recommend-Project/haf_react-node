/* YYYY-MM-DD 형식의 문자열로 반환
* getDate: 날짜
* symbol: 사용할 기호
* */
export function getDateContainingZero(getDate, symbol= "-") {
    // console.log(`지금 getDate 형식은 ?? >> ${ typeof getDate}`)
    let date = typeof getDate === Object ?  getDate : new Date(getDate);
    if(typeof symbol !== String) symbol = symbol.toString();

    //년,월,일,시,분,초
    let year , month , day , hours , minutes , seconds;
     year = date.getFullYear();
     month = date.getMonth() + 1;
     day = date.getDate();
     hours = date.getHours();
     minutes = date.getMinutes();
     seconds = date.getSeconds();
    let timeArr = [year, month , day , hours , minutes , seconds];

    let stringDate = timeArr.reduce((addString, time)=>{
       if(time === year) addString += time;
       else addString += (time < 10 ? symbol + "0" : symbol) + time;

        return addString;
    },"" );

    return {stringDate, symbol};
}


/* 날짜의 기호 및 출력 길이를 받아 반환해주는 함수
* getDate: 날짜
* length: 출력할 길이(앞에서 부터 1~6)
* symbol: 사용할 기호( 1. y-m-d 2. h:m:s 날짜와 시간으로 분리)
* */
export function changeDateFormatting (getDate, length= 6, firstSymbol = "-", secondSymbol = ":") {
    //6이상의 숫자 입력 방지
    if(6 < length) length = 6;
    if(typeof firstSymbol !== String) firstSymbol = firstSymbol.toString();
    if(typeof secondSymbol !== String) secondSymbol = secondSymbol.toString();

    //입력 받은 날짜를 문자열로 바꾸어준 다음 "-"를 기준으로 배열로 쪼개준다.
    let StringDateObject = getDateContainingZero(getDate);
    let StringDateToArray = StringDateObject.stringDate.split(StringDateObject.symbol);

    let completeChangeDate = StringDateToArray.reduce((newDate, time, index)=>{
        if(index === length-1){
            // 마지막 날짜 뒤에는 아무 문자도 포함되면 안되므로
            newDate += time;
        }else if(index < length){
            switch (index) {
                case 0: case 1: //년,월
                    newDate += time + firstSymbol;
                    break;
                case 3: case 4: //시,분
                    newDate += time + secondSymbol;
                    break;
                case 2: case 5: //일,초
                    newDate += time + " ";
                    break;
                default:
                    break;
            }
        }
        return newDate;
    },"");

    return completeChangeDate;
}

//상품 badge 멘트 반환
export function badgeText (sales){
    let text = "";
    if(sales < 10) text = "신상품";
    else if(sales < 50) text = "인기상품";
    else if(sales < 100) text = "주문폭주";
    else if(sales < 200) text = "품절대란";

    return text;
}
//객체에 다른 객체 추가
export function addingObjectToObject (originObject, returnObject = {}){
    for(let i in Object.keys(originObject)){
        returnObject[Object.keys(originObject)[i]] = originObject[Object.keys(originObject)[i]];
    }
    return returnObject;
}

// 쿠키 가져오기 함수
export function getCookie(cName) {
    cName = cName + "=";
    let cookieData = document.cookie;
    let start = cookieData.indexOf(cName);
    let cValue = "";
    if (start !== -1) {
        start += cName.length;
        let end = cookieData.indexOf(";", start);
        if (end === -1) end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

// 쿠키 삭제하기 함수 window.location.host
export function deleteCookie(name, path = "/", domain = "") {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let cookieValue =
        name +
        "=" +
        (path && ";path=" + path) +
        (domain && ";domain=" + domain) +
        ";expires=" +
        date.toUTCString();

    if (getCookie(name)) {
        document.cookie = cookieValue;
    }
    return;
}

// 쿠키 저장하기 함수
export function setCookie(name, value = "", days = "") {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
    return;
}