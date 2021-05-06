import React, {useEffect} from "react";
import {Button} from "react-bootstrap";
import axios from "axios";

function Logout({history}) {

    useEffect(async () => {
        axios.get("/customer/isLogin")
            .then(res => {
                if (res.data === "ppfalse") {
                    alert('로그인 정보가 없습니다..');
                    history.push("/customer/login");
                }
            })
            .catch(err => alert(err))
    },[])

    let onLogout = async()=>{
        let url = '/customer/logout';
        fetch(url,{ method:"get"})
            .then(res => {
                alert('로그아웃 성공');
                history.push('/');
            })
            .catch(err => {
                console.log('로그아웃 실패');
                console.log(err);
            })
    }

    return(
        <>
            <h1>logout</h1>
            <Button onClick={e=>{e.preventDefault(); onLogout();}}>로그아웃</Button>
        </>
    );
}

export default Logout;