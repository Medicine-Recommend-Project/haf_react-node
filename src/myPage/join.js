import React, {useState, useEffect} from "react";
import axios from "axios";

function join(){
    //https://xn--xy1bk56a.run/axios/guide/form-format.html#%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80
    const qs = require('qs');

    const[check, setCheck] = useState({idCheck : "false", pwCheck : "false"});
    const[checkRs, setCheckRs] = useState("");

    //input들을 관리하기 위함
    const [inputs, setInputs] = useState({
        cId: "",
        cName: "",
        cPw: "",
        pwCheck: "",
        cPh: "",
        cEmail: "",
        cAddress: ""
    });

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

    //const{cId, cName, cPw, cPh, cEmail, cAddress} = inputs;

    let checkNothing = () => {
        for(let i = 0; i < 7 ; i++){
            // console.log(Object.keys(inputs)[i], ' : ', inputs[Object.keys(inputs)[i]]); // ← state의 key : value 값 console에 찍어줌
            if(inputs[Object.keys(inputs)[i]] === "" || inputs[Object.keys(inputs)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                break;
            }//end of if()
        }//end of for()
    }; //end of checkNothing()

    let checkId = () => {

        axios.post('http://localhost:8008/customer/checkId',
            JSON.stringify({cId: inputs.cId}),
            {headers: {
                    "Content-Type": 'application/json;charset=utf-8',
                    withCredentials: true
                },
            })
            .then(response => {
                console.log('checkId 응답 성공');
                console.log(response.data);

                if(response.data > 0){
                    setCheck({
                        ...check,
                        idCheck: "false"
                    });
                    setCheckRs('이미 사용중인 아이디입니다!');
                    alert("된건가");
                }else{
                    setCheck({
                        ...check,
                        idCheck: "true"
                    });
                    setCheckRs('사용가능한 아이디입니다!');
                }
            })
            .catch(error => {
                    if (error.response) {
                        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                        console.log('error.response');
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                    else if (error.request) {
                        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                        // Node.js의 http.ClientRequest 인스턴스입니다.
                        console.log('error.request');
                        console.log(error.request);
                    }
                    else {
                        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                }
            );

    };//end of checkId()

    let submitForm = async () => {
        const url = 'http://localhost:8008/customer/join';
        const axiosConfig = {
            headers: {
                // "Content-Type": "application/json"
                'Content-Type': 'multipart/form-data',
                withCredentials: true
            }
        }
        const formData = new FormData();

        for(let i = 0; i < 7 ; i++){
            // console.log(Object.keys(inputs)[i], ' : ', inputs[Object.keys(inputs)[i]]);
            formData.append(Object.keys(inputs)[i],inputs[Object.keys(inputs)[i]]);
        }//end of for()

        axios.post(url, formData, axiosConfig)
            .then(res => {
                console.log('통신 성공');
                console.log(res);
                console.log(res.data);
            }).catch(e => {
            console.log('여기서도 안되네~~');
            console.log(e);
        })
    }

    return(
        <div>
            <h3>회원 가입</h3>
            <form onSubmit={(e)=>{
                e.preventDefault();
                checkNothing();
                if(check.idCheck === "false") {
                    alert('아이디 중복 검사를 완료해주세요.');
                }
                if (check.pwCheck === "false") {
                    alert('비밀번호가 일치하지 않습니다.');
                }
                submitForm();
            }}>
                <table>
                    <tr>
                        <td>아이디</td>
                        <td><input type="text" name="cId" placeholder="아이디 입력" onChange={onTyping} value={inputs.cId}/></td>
                        <td><button onClick={(e)=>{
                            e.preventDefault();
                            checkId();
                        }}>중복검사</button></td>
                        <td>{checkRs}</td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td><input type="text" name="cName" onChange={onTyping} value={inputs.cName}/></td>
                    </tr>
                    <tr>
                        <td>비밀번호</td>
                        <td><input type="password" name="cPw" placeholder="비밀번호 입력" onChange={ onTyping } value={inputs.cPw}/></td>
                    </tr>
                    <tr>
                        <td>비밀번호 확인</td>
                        <td><input type="password" name="pwCheck" placeholder="비밀번호 재입력" onChange={ onTyping } value={inputs.pwCheck}/></td>
                    </tr>
                    <tr>
                        <td>핸드폰</td>
                        <td><input type="text" name="cPh" placeholder="숫자만 입력하세요"onChange={onTyping} value={inputs.cPh}/></td>
                    </tr>
                    <tr>
                        <td>이메일 주소</td>
                        <td><input type="mail" name="cEmail" placeholder="example@mail.com"onChange={onTyping} value={inputs.cEmail}/></td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td><input type="text" name="cAddress" placeholder="추 후 API적용 예정"onChange={onTyping} value={inputs.cAddress}/></td>
                    </tr>
                    <tr><button type="submit" onSubmit={(e)=>{e.preventDefault();}}>가입하기</button></tr>
                </table>
                아이디 체크 : {check.idCheck} <br/>
                비번 체크 : {check.pwCheck}
            </form>
        </div>
    );
}

export default join;