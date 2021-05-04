import React, {useState} from "react";
import axios from "axios";

function Login({history}) {
    const [user, setUser] = useState({ cid : "", cpw : "" });

    //input창 값 입력 시 useState에 반영
    let onTyping = (e)=> {
        setUser({...user, [e.target.name]: e.target.value});
    }// end of onTyping()

    let loginUser = async(e)=> {
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
            <form name="loginForm" onSubmit={loginUser}>
                <input type="text" name="cid" value={user.cid} onChange={onTyping} placeholder="ID"/><br/>
                <input type="password" name="cpw" value={user.cpw} onChange={onTyping} placeholder="PW"/><br/>
                <button type="submit">로그인</button>
            </form>
        </>
    );


}

export default Login;