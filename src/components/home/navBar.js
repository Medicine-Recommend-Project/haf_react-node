import React, {useState} from 'react';
import {Navbar, Nav, Button, Image} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {useSelector} from "react-redux";
import axios from "axios";
import {Input, InputGroup} from "reactstrap";

function NavBar(){
    const [search, setSearch] = useState("");
    let history = useHistory();
    let basketCount = useSelector((store)=>store.basketReducer.count);
    let loginCheck = useSelector((store)=>store.loginReducer.login);

    let userIconHandler = ()=>{
        if (loginCheck) {
            history.push("/customer/mypage");
        }else {
            history.push("/customer/login");
        }
    }

    let searchProduct = ()=>{
        let url = "/product/search";
        let s = ('%'+search+'%').toString()
        let data = {search: s}
        axios.post(url, data)
            .then(res => {
                setSearch("");
                history.push({
                    pathname: '/product/search',
                    product: res.data
                });
            })
            .catch(err => console.log(err))
    }

    return(
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky={"top"}>
                <Navbar.Brand href="/"><img src="/navLogo.png" alt="로고" width={70} height={50}/></Navbar.Brand>
                <Nav className="mr-auto">
                    <InputGroup  style={{width:"80%"}}>
                        <Input type="text" value={search} onChange={(e)=>{setSearch(e.target.value);}} placeholder="상품 명 검색"/>
                        <Button onClick={()=>{searchProduct()}} size="sm" color="secondary">검색</Button>
                    </InputGroup>
                </Nav>

                <Nav style={{cursor:"pointer"}}>
                    <Image src="/navUser_Icon.png" onClick={()=>{userIconHandler();}} style={{width:"40px",height:"40px", marginRight:"10px"}} alt="사용자 아이콘"/>
                    <div onClick={()=>{history.push('/order/basket')}} style={{position:"relative"}} >
                        <img src="/navBasket_Icon.png" style={{width:"40px",height:"40px"}} alt="장바구니 아이콘"/>
                        <div style={{position:"absolute",top:"0",right:"0",padding:"3px", width:"20px", color:"#FFF", backgroundColor:"red", borderRadius:"100%"}}>
                            { basketCount }
                        </div>
                    </div>
                </Nav>
            </Navbar>
    );
}

export default NavBar;