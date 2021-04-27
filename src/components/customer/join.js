import React, {useEffect, useState} from "react";
import axios from "axios";
import DaumPostcodeAPI from "../home/DaumPostcodeAPI";

function Join({history}){

    // id 중복 체크 검사여부 및 비밀번호&비밀번호 확인 일치 여부
    const[check, setCheck] = useState({idCk : false, pwCk : false});
    // 위의 check 결과를 유동적으로 view에 띄워주기 위함
    const[checkRs, setCheckRs] = useState({idRs : "", pwRs : "", emRs : "", phRs : ""});
    // input들을 관리하기 위함
    const [inputs, setInputs] = useState({
        cId: "", name: "", cPw: "", pwCheck: "", ph: "", email: "", zonecode : "", address: "", detailAddress: ""
    });
    const [open, setOpen] = useState(false);    //다음 주소api를 팝업처럼 관리하기 위함
    // 밑에 useEffect로 setOpen관리하는 이유 : https://velog.io/@ohgoodkim/-%EC%97%90%EB%9F%AC%EB%85%B8%ED%8A%B8-Cant-perform-a-React-state-update-on-an-unmounted-component
    useEffect(() => {
        return () => {
            //useState를 true나 false로 지정하면 이렇게 기본 값 설정해줘야 콘솔창에 에러안나나 보다
            setOpen(false);
            setCheck({...check, idCk : false, pwCk : false});
        } // cleanup function을 이용
    }, []);

    // 정규식 참고 : https://uznam8x.tistory.com/62 //정규식 세부내용 알고싶으면 https://xively.tistory.com/22
    //이메일 형식 검사
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    // 대/소문자,숫자 포함하여 6글자 이상
    const regEngNum6 = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.+?[^\W|_])[\w!@#$%^&*()-_+={}\|\\\/]+$/g;
    // 대/소문자만 4글자 이상되고 숫자는 0회이상 포함
    const regEng4 = /^.*(?=.{4,})([a-zA-Z]+)(\d*)/g;
    // 핸드폰 번호 입력 시 하이픈 넣어주려고 만듦 (구 번호는 어떻게할지 고민중...)
    const regNumOnly = /[^0-9]/g;   //숫자가 아닌 것
    const regPh1 = /^(\d{3})(\d)/;
    const regPh2 = /^(\d{3}-\d{4})(\d)/;

    //input창에 입력을 하면 state에 값을 저장
    let onTyping = (e)=>{
        //e.target하면 해당 함수가 실행 된 tag가 선택됨. 그 안에서 name과 value값을 가져와 저장하는 것
        setInputs({ ...inputs, [e.target.name]: e.target.value });

        // 비밀번호 일치 여부, 정규식 만족 여부
        switch (e.target.name){

            case 'cId':
                if(regEng4.test(e.target.value)){
                    setCheckRs({...checkRs, idRs:'⭕ 중복검사를 완료해주세요.'});
                }else {
                    setCheckRs({...checkRs, idRs:'❌ 영문/숫자만 포함 된 4글자 이상이여야합니다.'});
                }

                setCheck({ ...check, idCk: false });
                break;

            case 'cPw':
                if(e.target.value === inputs.pwCheck) { setCheck({ ...check, pwCk: true  }); }
                else { setCheck({ ...check, pwCk: false }); }

                if(regEngNum6.test(e.target.value)){
                    setCheckRs({...checkRs, pwRs:'🟢'});
                }else{
                    setCheckRs({...checkRs, pwRs:'❌ 영문/숫자만 포함 6글자 이상이여야합니다.'});
                    setCheck({ ...check, pwCk: "false"  });
                }
                break;

            case 'pwCheck':
                if(e.target.value === inputs.cPw){ setCheck({ ...check, pwCk: true  }); }
                else{ setCheck({ ...check, pwCk: "false" }); }

                //정규식을 만족하지 못하면 pwCk는 false
                if(!regEngNum6.test(e.target.value)) setCheck({ ...check, pwCk: false });
                break;

            case 'email':
                if(regEmail.test(e.target.value)){ setCheckRs({...checkRs, emRs:'🟢'}); }
                else{ setCheckRs({...checkRs, emRs:'❌ 이메일 형식에 맞지 않습니다. 근데 이건 형식 안맞아도 가입됨'}); }
                break;

            case 'ph':
                let value = e.target.value.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌
                //핸드폰 번호 중간에 - 넣어주기
                if (regPh1.test(value)) { value = value.replace(regPh1, '$1-$2'); }
                if (regPh2.test(value)) { value = value.replace(regPh2, '$1-$2'); }
                // - 들어간 번호를 다시 useState의 ph에 넣어주기
                setInputs({ ...inputs, ph: value });
                break;

            default: return;    //위 case의 이름에 해당하는 애들이 아니면 return;
        }//end of switch
        // console.log(e.target.name," : ", e.target.value);

    }; //end of onTyping()

    //유효성(빈 칸, id 중복 검사, pw 조건 만족) 체크
    let validationCheck = () => {
        let vc = 3; // 회원가입 위한 조건이 다 만족하는지 체크하기 위해서 만듦. 왠지 모르겠는데 그냥 return;해도 밑에 문장들까지 싹 실행하길래...ㅠㅠ

        for(let i in Object.keys(inputs)){
            // console.log(Object.keys(inputs)[i], ' : ', inputs[Object.keys(inputs)[i]]); // ← state의 key : value 값 console에 찍어줌
            if(inputs[Object.keys(inputs)[i]] === "" || inputs[Object.keys(inputs)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                vc += 1;
                break;
            }//end of if()
        }//end of for()
        vc -= 1;
        if(check.idCk ? vc -= 1 : alert('아이디 중복 검사를 완료해주세요.') );
        if(check.pwCk ? vc -= 1 : alert('비밀번호가 조건에 만족하지 않습니다.') );

        return vc;
    }; //end of validationCheck()

    //아이디 중복 검사
    let checkId = async() => {

        // 아이디 유효성 검사(페이지 로딩 후 빈 값일때도 통신이 되어서)
        if(!regEng4.test(inputs.cId)){
            setCheckRs({...checkRs, idRs:'❌ 영문/숫자만 포함 된 4글자 이상이여야합니다'});
            setCheck({ ...check, idCk: false });
            return;
        }

        let url = '/customer/checkId';
        let data = {"cId": inputs.cId};

        fetch(url,{
            method:"post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),	// json화 해버리기
        })
            .then(res => res.json())
            .then(json => {
                if(json === 0){
                    setCheck({ ...check, idCk: true });
                    setCheckRs({...checkRs, idRs:'🟢'});
                }else{
                    setCheck({ ...check, idCk: false });
                    setCheckRs({...checkRs, idRs:'❌ 이미 사용중인 아이디입니다!'});
                }
            })
            .catch(error => { console.log(error); });
    }//end of _checkId()

    //daum 주소검색 API 팝업 띄운 후 입력된 값 받아오기
    let daumHandler = (data) => {
        let api = {};
        api = data;
        // console.log(api);
        setInputs({...inputs, address: api.fullAddress, zonecode : api.zonecode});
        setOpen(false);
    }

    //회원 가입 폼 제출
    let submitForm = async () => {
        let url = '/customer/join' ;
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(inputs)){
            data[Object.keys(inputs)[i]] = inputs[Object.keys(inputs)[i]];
        }//end of for

        axios.post(url, JSON.stringify(data), { headers: {"Content-Type": "application/json"} })
            .then(res => {
                if(res.data > 0){
                    alert('가입 성공. 환영합니다!');
                    setInputs({...inputs, cId: "", name: "", cPw: "", pwCheck: "", ph: "", email: "", zonecode : "", address: "", detailAddress: ""})
                    history.push('/customer/login');
                }else{
                    alert('가입에 실패하였습니다. 다시 시도해주세요.');
                }
            }).catch(e => {
                console.log(e);
                alert('가입에 실패하였습니다. 다시 시도해주세요.');
        });//end of axios.post();
    }//end of submitForm()

    return(
        <div>
            <h3>회원 가입</h3>
            <form onSubmit={(e)=>{
                e.preventDefault();
                if(validationCheck() > 0 ? console.log('유효성 검사 실패') : submitForm() );
            }}>
                아이디
                <input type="text" name="cId" placeholder="영문/숫자 포함 5자리 이상" onChange={onTyping} value={inputs.cId}/>
                <button onClick={(e)=>{
                    e.preventDefault();
                    checkId();
                }}>중복검사</button>
                {checkRs.idRs} <br/>
                이름
                <input type="text" name="name" onChange={onTyping} value={inputs.name}/><br/>
                비밀번호
                <input type="password" name="cPw" placeholder="비밀번호 입력" onChange={ onTyping } value={inputs.cPw}/>
                {checkRs.pwRs} <br/>
                비밀번호 확인
                <input type="password" name="pwCheck" placeholder="비밀번호 재입력" onChange={ onTyping } value={inputs.pwCheck}/><br/>
                핸드폰
                <input type="text" name="ph" placeholder="숫자만 입력하세요"onChange={onTyping} value={inputs.ph}/><br/>
                이메일 주소
                <input type="mail" name="email" placeholder="example@mail.com"onChange={onTyping} value={inputs.email}/>
                {checkRs.emRs} <br/>
                주소<br/>
                {
                    open ? <DaumPostcodeAPI handler={daumHandler}/> : null
                }
                {inputs.zonecode} {inputs.address} <button onClick={event => {event.preventDefault(); setOpen(true);}}>주소찾기</button>
                <br/>
                상세 주소
                <input type="text" name="detailAddress" onChange={onTyping} value={inputs.detailAddress}/>
                <br/>
                <button type="submit" onSubmit={(e)=>{e.preventDefault();}}>가입하기</button>
                <br/>
                {/*아이디 체크 : {check.idCk} <br/>*/}
                {/*비번 체크 : {check.pwCk}*/}
            </form>
        </div>
    );
}

export default Join;