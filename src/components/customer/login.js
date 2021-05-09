import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Form} from "react-bootstrap";
import {Input} from "reactstrap";

function Login({history}) {
    const [user, setUser] = useState({ cid : "", cpw : "" });

    useEffect(async () => {
        axios.get("/customer/isNotLogin")
            .then(res => {
                if (res.data === "pptrue") {
                    alert('이미 로그인 중입니다.');
                    history.push("/");
                }
            })
            .catch(err => alert(err))
    },[])

    //input창 값 입력 시 useState에 반영
    let onTyping = (e)=> {
        setUser({...user, [e.target.name]: e.target.value});
    }// end of onTyping()

    let loginUser = (e)=> {
        e.preventDefault();
        if(user.cid === "" || user.cpw === "") {
            alert('빈칸을 채워주세요');
            return;
        }
        let url = '/customer/login';
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(user)){
            data[Object.keys(user)[i]] = user[Object.keys(user)[i]];
        }//end of for

        axios.post(url, JSON.stringify(data), { headers: {"Content-Type": "application/json"} })
            .then(res => {
                if(res.data === 'false'){ alert('아이디/비밀번호가 틀렸습니다.'); }
                else {
                    alert('로그인 성공');
                    history.goBack();
                }
            }).catch(e => {
                console.log(e);
                alert('로그인 실패. 다시 시도해주세요.');
        });//end of axios.post();
    }

    return(
        <>
            <h1>Login</h1>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Form name="loginForm" onSubmit={loginUser} >
                <Col>
                    <Input type="text" name="cid" value={user.cid} onChange={onTyping} placeholder="ID" sm={2} bsSize="lg"/><br/>
                </Col>
                <Col>
                    <Input type="password" name="cpw" value={user.cpw} onChange={onTyping} placeholder="PW" sm={2} bsSize="lg"/><br/>
                </Col>
                <Button type="submit">로그인</Button>
                <Button onClick={()=>{history.push('/customer/join')}}>회원가입</Button>
            </Form>
            </div>
        </>
    );


}

export default Login;