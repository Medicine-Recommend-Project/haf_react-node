import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from "axios";

function NavBar2(){
    let history = useHistory();
    const list = ['두뇌건강', '피부', '관절', '장건강', '안구', '유산균', '갱년기', '비타민', '다이어트', '어린이', '면역력'];


    let searchType = (type)=>{
        let url = "/api/product/type";
        let data = {type: type};
        axios.post(url, data)
            .then(res => {
                history.push({
                    pathname: '/product/search',
                    product: res.data
                });
            })
            .catch(err => alert('요청이 실패되었습니다.'))
    }

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="text-xl-center mx-auto" >
                    <div style={{fontSize:"150%", fontWeight:"bold", color: "#FFF", textAlign:"justify", cursor:"pointer"}}>
                        <ul className="list-inline d-inline-flex">
                            <li onClick={()=>{searchType('랭킹');}} style={{color:"red"}}  className="mx-3">랭킹</li>
                            {list.map(list => (
                                <li key={list} onClick={()=>{searchType(list);}} className="mx-3">{list}</li>
                            ))}
                        </ul>
                    </div>

                    <NavDropdown title="내 정보" id="collasible-nav-dropdown">
                        <NavDropdown.Item onClick={()=>{history.push("/customer/join");}}>회원가입</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>{history.push("/customer/mypage");}}>내정보 관리</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>{history.push("/order/paymentList");}}>결제 내역</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>{history.push("/board/inquiry");}}>문의 하기</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>{history.push("/board/myBoardList");}}>나의 게시글</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar2;