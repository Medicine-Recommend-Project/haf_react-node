import React from "react";

function Logout({history}) {

    let onLogout = async()=>{
        let url = '/customer/logout';
        fetch(url,{ method:"get",})
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
            <button onClick={e=>{e.preventDefault(); onLogout();}}>로그아웃해라</button>
        </>
    );
}

export default Logout;