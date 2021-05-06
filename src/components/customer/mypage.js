/* eslint-disable */
import React, {useEffect, useState} from 'react';
import axios from "axios";
import DaumPostcodeAPI from "../home/DaumPostcodeAPI";
import ChangeCpw from "./changeCpw";
import {Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";

function Mypage({history}) {  //라우트 통해서 매개변수처럼 들고오는 애라... history를 따로 선언해줘야 먹히네
    //정규식...
    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    const regNumOnly = /[^0-9]/g;   //숫자가 아닌 것
    const regPh1 = /^(\d{3})(\d)/;
    const regPh2 = /^(\d{3}-\d{4})(\d)/;

    const [user, setUser] = useState({
        cid: "", cname: "", ph: "", email: "", zonecode:"", address: "", detailAddress: ""
    });
    const [checkRs, setCheckRs] = useState("");
    const [open, setOpen] = useState({ daum: false, changeCpw: false });    //다음 주소api를 팝업처럼 관리하기 위함
    //팝업창 오픈 관리
    useEffect( ()=> setOpen({ ...open, daum: false, changeCpw: false }),[]);

    //로그인 된 아이디로 유저정보 검색해오기
    useEffect( ()=>{
        let url = '/customer/userinfo';
        axios.post(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.replace('/customer/login');
                }
                setUser(res.data);
            })
            .catch(err => console.log(err))
    },[]);

    let onTyping = (e)=> {
        //e.target하면 해당 함수가 실행 된 tag가 선택됨. 그 안에서 name과 value값을 가져와 저장하는 것
        setUser({...user, [e.target.name]: e.target.value});
        switch (e.target.name){
            case 'email':
                if(regEmail.test(e.target.value)){ setCheckRs('🟢' ) }
                else{ setCheckRs('❌ 이메일 형식에 맞지 않습니다. 근데 이건 형식 안맞아도 가입됨') }
                break;

            case 'ph':
                let value = e.target.value.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌
                //핸드폰 번호 중간에 - 넣어주기
                if (regPh1.test(value)) { value = value.replace(regPh1, '$1-$2'); }
                if (regPh2.test(value)) { value = value.replace(regPh2, '$1-$2'); }
                // - 들어간 번호를 다시 useState의 ph에 넣어주기
                setUser({ ...user, ph: value });
                break;

            default: return;
        }
    }
    //다음 주소 api 완료 후
    let daumHandler = (data) => {
        let api = {};
        api = data;
        // console.log(api);
        setUser({...user, address: api.fullAddress, zonecode : api.zonecode});
        setOpen({...open, daum: false});
    }
    //비밀번호 변경 완료한 후
    let cpwHandler = (rs) =>{
        // console.log('비번 핸들러 rs : ' , rs);
        if(rs === "close"){ setOpen({...open, changeCpw: false}); }
    }

    //회원 정보 수정 폼 제출
    let submitForm = async () => {
        let url = '/customer/mypage' ;
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(user)){
            data[Object.keys(user)[i]] = user[Object.keys(user)[i]];
        }//end of for

        axios.post(url, JSON.stringify(data), { headers: {"Content-Type": "application/json"} })
            .then(res => {
                if(res.data > 0){
                    alert('수정되었습니다.');
                    setUser({...user, cId: "", cname: "", cPw: "", pwCheck: "", ph: "", email: "", zonecode : "", address: "", detailAddress: ""})
                    history.push('/');
                }else{
                    alert('수정에 실패하였습니다. 다시 시도해주세요.');
                }
            }).catch(e => {
            console.log(e);
            alert('수정에 실패하였습니다. 다시 시도해주세요.');
        });//end of axios.post();
    }//end of submitForm()

    return(
        <div>
            마이페이지다 <br/>
            <FormGroup row>
                <Label sm={2}>아이디</Label>
                <Col sm={3}>
                    <Input name="cId" value={user.cid} readOnly/>
                </Col>
            </FormGroup>{/* 아이디 FormGroup*/}
            <FormGroup row>
                <Label sm={2}>이름</Label>
                <Col sm={3}>
                    <Input type="text" name="cname" onChange={onTyping} value={user.cname}/>
                </Col>
            </FormGroup>{/* 이름 FormGroup*/}
            <FormGroup row>
                <Label sm={2}> 비밀번호 </Label>
                <Button onClick={()=>{setOpen({...open, changeCpw: true});}} color="warning">비밀번호 변경</Button><br/>
                { open.changeCpw ? <ChangeCpw cid={user.cid} handler={cpwHandler}/> : null }
            </FormGroup>{/* 비번 FormGroup*/}
            <FormGroup row>
                <Label sm={2}> 핸드폰 </Label>
                <Col sm={3}>
                    <Input type="text" name="ph" placeholder="숫자만 입력하세요"onChange={onTyping} value={user.ph}/>
                </Col>
            </FormGroup>{/*핸드폰 FormGroup*/}
            <FormGroup row>
                <Label sm={2}> 이메일 주소 </Label>
                <Col sm={3}>
                    <Input type="mail" name="email" placeholder="example@mail.com"onChange={onTyping} value={user.email}/>

                </Col>
                <Col sm={10} className={"text-left"}>
                    {checkRs}
                </Col>
            </FormGroup>{/*이메일 FormGroup*/}
            <FormGroup row>
                <Label sm={2}> 주소 </Label>
                <FormGroup>
                    <Col lg={12} className={"text-left"}>
                        {user.zonecode}{'  '}{user.address}
                    </Col>
                    <Row form>
                        <Col lg={8}>
                            <Input type="text" name="detailAddress" onChange={onTyping } value={user.detailAddress} placeholder="상세 주소 입력"/>
                        </Col>
                        <Col lg={4}>
                            <Button onClick={() =>{setOpen({...open, daum: true});} } color="warning">주소찾기</Button>
                        </Col>
                    </Row>
                </FormGroup>
                {
                    open.daum ? <DaumPostcodeAPI handler={daumHandler}/> : null
                } <br/>
            </FormGroup>{/*주소 FormGroup*/}
            <br/>
            <Button onClick={()=>{submitForm();}} color="warning">수정하기</Button><br/>
        </div>
    );
}

export default Mypage;