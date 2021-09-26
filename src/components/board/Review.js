import {useCallback, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import axios from "axios";
import {Button, Col, Form, FormGroup, Input, Label} from "reactstrap";

function Review({location}) {
    let history = useHistory();

    const pcode = location.pcode;
    const [user, setUser] = useState({cid:"", cname:""});
    const [review, setReview] = useState({
        ocode: "", pcode: "", category : "후기", rating: 5, title: "", content: ""
    })
    const [stars, setStars] = useState(['★','★','★','★','★']);

    useEffect(()=>{
        if(pcode){
            setReview({...review, ocode: location.product.ocode, pcode: location.product.pcode, pname: location.product.pname})
        }
    },[location])

    useEffect(async ()=>{
        let url = '/api/customer/isLogin' ;
        axios.get(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                setUser({...user, cid: res.data.cid, cname: res.data.cname})
            })
            .catch(err => console.log(err))
        // console.log(location);
    },[]);

    let onTyping = (e)=> {
        setReview({...review, [e.target.name]: e.target.value});
    }

    //평점 별 누르면 점수 및 별 색깔 바뀌게 함
    let starHandler = (i)=>{
        let changeStar = [...stars];
        setReview({...review, rating: i+1});
        for(let s = 0; s < stars.length; s++){
            if(s > i){ changeStar[s] = '☆' }
            else { changeStar[s] = '★' }
        }
        setStars(changeStar);
    }
    // 별 5개 뿌리기
    const rate = stars.map((rate, i) =>(
        <span key={i} onClick={e=>{ e.preventDefault(); starHandler(i); }} style={{cursor: "pointer"}}>{rate}</span>
    ));

    let submitForm = async (e)=>{
        e.preventDefault();

        for(let i in Object.keys(review)){
            if(review[Object.keys(review)[i]] === "" || review[Object.keys(review)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()

        let url = '/api/board/review' ;
        let data = { ...review };

        data["cid"] = user.cid;
        data["cname"] = user.cname;

        axios.post(url, data)
            .then(res => {
                if(res.data.result){
                    alert('글이 정상적으로 등록되었습니다.');
                    history.push('/');
                }else{
                    alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
                }
            })
            .catch(err => {
                console.log(err);
                alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
            });//end of axios.post();
    }// end of submitForm();

    return(
        <div>
            <h1>후기 게시판</h1>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Form onSubmit={submitForm}>
                    <FormGroup row>
                        <Col lg={4}>
                            <Label>주문코드</Label>
                        </Col>
                        <Col lg={8}>
                            <Input value={review.ocode} readOnly/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label>상품</Label>
                        </Col>
                        <Col lg={9}>
                            <Input type="text" name="pcode" value={review.pname} bssize="sm" readOnly />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label>제목</Label>
                        </Col>
                        <Col lg={9}>
                            <Input type="text" name="title"  value={review.title} onChange={onTyping} placeholder="제목을 입력해주세요." />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label>작성자</Label>
                        </Col>
                        <Col>
                            {user.cname}님 ({user.cid})
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3} className="text-center" >
                            <Label style={{verticalAlign:"middle"}}>평점</Label>
                        </Col>
                        <Col lg={9}>
                            <span style={{color:"gold", fontWeight:"bold", fontSize:"200%", height:"100%"}}>{rate}</span>
                            {'  '}
                             <span style={{color:"red", fontWeight:"bold", fontSize:"130%"}}>{review.rating}</span>점
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col lg={3}>
                            <Label>내용</Label>
                        </Col>
                        <Col lg={9}>
                            <Input type="textarea" name="content" value={review.content} onChange={onTyping} id="content" cols="30" rows="5"> </Input>
                        </Col>
                    </FormGroup>
                     <br/>
                    <Button type="submit" size="lg">작성하기</Button>
                </Form>
            </div>
        </div>
    );
}

export default Review;