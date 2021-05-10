import React from 'react';
import {Navbar, Nav, NavDropdown, Button, Image} from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {Col, DropdownItem, Input, NavItem, NavLink, Row} from "reactstrap";
import {doLogout} from "../../store/actions/loginActions";

function NavBar2(){
    let history = useHistory();
    let dispatch = useDispatch();
    let loginCheck = useSelector((store)=>store.loginReducer.login);

    let searchType = (type)=>{
        let url = "/product/type";
        let data = {type: type};
        axios.post(url, data)
            .then(res => {
                console.log(res.data);
                history.push({
                    pathname: '/product/search',
                    product: res.data
                });
            })
    }

    let onLogout = ()=>{
        let url = '/customer/logout';
        fetch(url,{ method:"get"})
            .then(res => {
                alert('로그아웃 성공');
                dispatch(doLogout());
                history.push('/');
            })
            .catch(err => {
                console.log('로그아웃 실패');
                console.log(err);
            })
    }

    return(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="text-xl-center mx-auto" >
                        <div style={{fontSize:"150%", fontWeight:"bold", color: "#FFF", textAlign:"justify", cursor:"pointer"}}>
                            <ul className="list-inline d-inline-flex">
                                <li onClick={()=>{searchType('랭킹');}} style={{color:"red"}}  className="mr-2 ml-2 p-2 ">랭킹</li>
                                <li onClick={()=>{searchType('두뇌');}} className="mr-2 ml-2 p-2 ">두뇌</li>
                                <li onClick={()=>{searchType('피부');}} className="mr-2 ml-2 p-2 ">피부</li>
                                <li onClick={()=>{searchType('관절');}} className="mr-2 ml-2 p-2 ">관절</li>
                                <li onClick={()=>{searchType('장건강');}} className="mr-2 ml-2 p-2 ">장건강</li>
                            </ul>
                        </div>
                    </Nav>
                    <Nav>
                        {(
                            loginCheck ?
                                <Button variant="primary" onClick={()=>{onLogout();}}>로그아웃</Button>
                                :
                                <Link to="/customer/login">
                                    <Button variant="primary">로그인</Button>
                                </Link>
                        )}

                        <NavDropdown title="내 정보" id="collasible-nav-dropdown">
                            <NavDropdown.Item onClick={()=>{history.push("/customer/join");}}>회원가입</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>{history.push("/customer/mypage");}}>내정보 관리</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>{history.push("/order/paymentList");}}>결제 내역</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>{history.push("/board/inquiry");}}>문의 하기</NavDropdown.Item>
                        </NavDropdown>
                        <Link to="/product/upload">
                            <Button variant="outline-primary">upload</Button>
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
    );
}

export default NavBar2;