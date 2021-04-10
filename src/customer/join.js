import React, {useState} from "react";
import axios from "axios";

function Join(){

    // id 중복 체크 검사여부 및 비밀번호&비밀번호 확인 일치 여부
    const[check, setCheck] = useState({idCheck : "false", pwCheck : "false"});
    // 위의 check 결과를 유동적으로 view에 띄워주기 위함
    const[checkRs, setCheckRs] = useState("");
    // input들을 관리하기 위함
    const [inputs, setInputs] = useState({
        cId: "", name: "", cPw: "", pwCheck: "", ph: "", email: "", address: ""
    });

    // 통신 시 header에 json타입으로 config 지정할 때 사용
    let jsonHeaderConfig = {
        headers: { "Content-Type": "application/json" }
    }
    // 정규식
    const eng = /^[a-z|A-Z]*$/;
    const num = /^\d*$/;

    //input창에 입력을 하면 state에 값을 저장
    let onTyping = (e)=>{
        //e.target하면 해당 함수가 실행 된 tag가 선택됨. 그 안에서 name과 value값을 가져와 저장하는 것
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
        // console.log(e.target.name," : ", e.target.value);
        if (e.target.name === 'cPw') {
            if(e.target.value === inputs.pwCheck){
                setCheck({
                    ...check,
                    pwCheck: "true"
                });
            }else{
                setCheck({
                    ...check,
                    pwCheck: "false"
                });
            }//end of inner if()
        }else if (e.target.name === 'pwCheck') {
            if(e.target.value === inputs.cPw){
                setCheck({
                    ...check,
                    pwCheck: "true"
                });
            }else{
                setCheck({
                    ...check,
                    pwCheck: "false"
                });
            }//end of inner if()
        }//end of outer if()
    }; //end of onTyping()

    //유효성(빈 칸, 정규 표현식 만족) 체크
    let validationCheck = () => {
        let vc = 3;

        for(let i in Object.keys(inputs)){
            // console.log(Object.keys(inputs)[i], ' : ', inputs[Object.keys(inputs)[i]]); // ← state의 key : value 값 console에 찍어줌
            if(inputs[Object.keys(inputs)[i]] === "" || inputs[Object.keys(inputs)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                vc += 1;
                break;
            }//end of if()
        }//end of for()
        vc -= 1;
        if(check.idCheck === "false" ? alert('아이디 중복 검사를 완료해주세요.') : vc -= 1 );
        if(check.pwCheck === "false" ? alert('비밀번호가 일치하지 않습니다.') : vc -= 1 );

        return vc;
    }; //end of validationCheck()

    //아이디 중복 검사
    let checkId = async() => {

        if(inputs.cId === null || inputs.cId === ""){
            setCheckRs('아이디를 입력하세요.');
            return;
        }else if(inputs.cId.length < 6 ){
            setCheckRs('아이디는 영문/숫자 포함 5자리 이상이여야합니다.');
            return;
        }


        let url = '/customer/checkId';
        let data = {"cId": inputs.cId};

        fetch(url,{
            method:"post",
            jsonHeaderConfig,
            body: JSON.stringify(data),	// json화 해버리기
        })
            .then(res => res.json())
            .then(json => {
                if(json === 0){
                    setCheck({
                        ...check,
                        idCheck: "true"
                    });
                    setCheckRs('사용가능한 아이디입니다!');
                }else{
                    setCheck({
                        ...check,
                        idCheck: "false"
                    });
                    setCheckRs('이미 사용중인 아이디입니다!');
                }
            })
            .catch(error => {
                    console.log(error);
                }
            );
    }//end of _checkId()


    let submitForm = async () => {
        const url = '/customer/join';
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(inputs)){
            data[Object.keys(inputs)[i]] = inputs[Object.keys(inputs)[i]];
        }//end of for()

        axios.post(url, JSON.stringify(data), jsonHeaderConfig)
            .then(res => {
                console.log(res.data);
                if(res.data > 0 ? alert('가입 성공') : alert('가입에 실패하였습니다. 다시 시도해주세요.'));
            }).catch(e => {
            console.log(e);
            alert('가입에 실패하였습니다. 다시 시도해주세요.');
        });
    }

    return(
        <div>
            <h3>회원 가입</h3>
            <form onSubmit={(e)=>{
                e.preventDefault();
                if(validationCheck() > 0 ? console.log('유효성 검사 실패') : submitForm()) ;
            }}>
                아이디
                <input type="text" name="cId" placeholder="영문/숫자 포함 5자리 이상" onChange={onTyping} value={inputs.cId}/>
                <button onClick={(e)=>{
                    e.preventDefault();
                    checkId();
                }}>중복검사</button>
                {checkRs}
                <br/>
                이름
                <input type="text" name="name" onChange={onTyping} value={inputs.name}/><br/>
                비밀번호
                <input type="password" name="cPw" placeholder="비밀번호 입력" onChange={ onTyping } value={inputs.cPw}/><br/>
                비밀번호 확인
                <input type="password" name="pwCheck" placeholder="비밀번호 재입력" onChange={ onTyping } value={inputs.pwCheck}/><br/>
                핸드폰
                <input type="text" name="ph" placeholder="숫자만 입력하세요"onChange={onTyping} value={inputs.ph}/><br/>
                이메일 주소
                <input type="mail" name="email" placeholder="example@mail.com"onChange={onTyping} value={inputs.email}/><br/>
                주소
                <input type="text" name="address" placeholder="추 후 API적용 예정"onChange={onTyping} value={inputs.address}/><br/>
                <button type="submit" onSubmit={(e)=>{e.preventDefault();}}>가입하기</button>
                <br/>
                아이디 체크 : {check.idCheck} <br/>
                비번 체크 : {check.pwCheck}
            </form>
        </div>
    );
}

export default Join;