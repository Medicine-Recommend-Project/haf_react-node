import {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {Button, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {FormLabel} from "react-bootstrap";

function Inquiry({location}) {
    let history = useHistory();

    const pcode = location.pcode;
    const [user, setUser] = useState({cid:"", cname:""});
    const [inquiry, setInquiry] = useState({
        pcode: "", category : "문의", DetailCategory: "상품문의",title: "", content: ""
    })
    const [products, setProducts] = useState({});

    useEffect(()=>{
        let url = '/api/product/getPcode' ;
        axios.get(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                if(res.data.panmeList.length > 0) setProducts([res.data.panmeList]);
                if(res.data.cid && res.data.cname) setUser({cid: res.data.cid, cname: res.data.cname});
                //여기 대충 다 한거 같긴한데, 재 확인할 것
                if(pcode){
                    setInquiry({...inquiry, pcode: pcode})
                }else{
                    setInquiry({...inquiry, pcode: res.data.panmeList[0].pcode}); // select 안바꾸면 기본 선택값은 첫번째 pcode...
                }
            })
            .catch(err => console.log(err))
    },[])

    let onTyping = (e)=> {
        setInquiry({...inquiry, [e.target.name]: e.target.value});
    }

    // products state가 초기화되기 전에 map을 쓰려고하니까 에러나서 &&으로 조건주기
    const productsList = products[0] && products[0].map(product => (
        <option key={product.pcode} value={product.pcode} >
            {product.pname}
        </option>
    ));

    let submitForm = (e)=>{
        e.preventDefault();

        for(let i in Object.keys(inquiry)){
            if(inquiry[Object.keys(inquiry)[i]] === "" || inquiry[Object.keys(inquiry)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()

        let url = '/api/board/inquiry' ;
        let data = {...inquiry};

        data["cid"] = user.cid;
        data["cname"] = user.cname;

        // console.log('data : ',data);
        axios.post(url, data)
            .then(res => {
                if(res.data.result){
                    alert('글이 정상적으로 등록되었습니다.');
                    history.push('/');
                }else{
                    alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
                }
            })
            .catch(e => {
                console.log(e);
                alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
            });//end of axios.post();
    }// end of submitForm();

    return(
        <div>
            <h2>문의 게시판입니다.</h2>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Form onSubmit={submitForm}>
                    <FormGroup row>
                        <Col lg={3}>
                            <FormLabel>문의</FormLabel>
                        </Col>
                        <Col lg={6}>
                            <Input type="select" name="DetailCategory" value={inquiry.DetailCategory} onChange={onTyping}>
                                <option value="상품문의">상품문의</option>
                                <option value="교환및반품">교환및반품</option>
                                <option value="결제문의">결제문의</option>
                                <option value="기타">기타</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label>상품</Label>
                        </Col>
                        <Col lg={9}>
                            <Input type="select" name="pcode" value={inquiry.pcode} onChange={onTyping} bssize="sm">
                                {productsList}
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <FormLabel>제목</FormLabel>
                        </Col>
                        <Col lg={9}>
                            <Input type="text" name="title"  value={inquiry.title} onChange={onTyping} placeholder="제목을 입력해주세요." />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label> 작성자 </Label>
                        </Col>
                        <Col lg={9}>
                            {user.cname}님 ({user.cid})
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <FormLabel>내용</FormLabel>
                        </Col>
                        <Col lg={9}>
                            <Input type="textarea" name="content" value={inquiry.content} onChange={onTyping} id="content" cols="30" rows="10"> </Input>
                        </Col>
                    </FormGroup>
                    <Button type="submit">작성하기</Button>
                </Form>
            </div>
        </div>
    );
}

export default Inquiry;