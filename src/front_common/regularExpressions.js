export const regPh1 = /^(\d{3})(\d)/;
export const regPh2 = /^(\d{3}-\d{4})(\d)/;
export const regNumOnly = /[^0-9]/g;   //숫자가 아닌 것

// 핸드폰 번호 입력 시 하이픈 넣어주려고 만듦 (구 번호는 어떻게할지 고민중...)
export function changePhoneFormatting(phoneNumber){
    let formattingNumber = "";
    formattingNumber = phoneNumber.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌

    //핸드폰 번호 중간에 - 넣어주기
    if (regPh1.test(formattingNumber)) { formattingNumber = formattingNumber.replace(regPh1, '$1-$2'); }
    if (regPh2.test(formattingNumber)) { formattingNumber = formattingNumber.replace(regPh2, '$1-$2'); }
    if(formattingNumber.length > 13) formattingNumber = formattingNumber.slice(0, -1);

    return formattingNumber;
}