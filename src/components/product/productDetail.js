import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import CommonPI from "../home/commonProductInformations";
import {useDispatch} from "react-redux";
import {addBasket} from "../../store/actions/basketActions";
import {Image, Tab, Tabs} from "react-bootstrap";
import {
    Badge, Button, ButtonGroup,
    Card, CardBody, CardTitle,
    Col, Input, Row, Table
} from "reactstrap";

function ProductDetail({match, history}) {
    let dispatch = useDispatch();
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [reviewBoards, setReviewBoards] = useState({});
    const [inquiryBoards, setInquiryBoards] = useState({});
    const [index, setIndex] = useState("0");

    useCallback(useEffect(()=>{
        if(match.params.pcode !== ""){
            let data = {"pcode" : match.params.pcode};
            let url = '/product/detail' ;
            axios.post(url, data)
                .then(res =>{
                    if(res.data !== null) setProduct(res.data);
                    else alert("상품 데이터를 가져오지 못했습니다! 다시 시도해주세요");
                })
                .catch(err => { console.log(err); })
        }else{
            alert('상품 정보를 가져오지 못했습니다. 메인으로 돌아갑니다.');
            history.push('/');
        }//end of if()
    },[]));

    //문의,후기게시글 가져오기
    useCallback(useEffect(()=>{
        let url = '/board/getBoards';
        let data = { where : '%' , pcode : match.params.pcode}
        axios.post(url, data)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                if(res.data.length > 0){
                    let boards = res.data;
                    let review = []; let inquiry = [];
                    for(let i = 0; i < boards.length; i++){
                        if(boards[i].category === '후기') review.push(boards[i]);
                        if(boards[i].category === '문의') inquiry.push(boards[i]);
                    }
                    setReviewBoards(review);
                    setInquiryBoards(inquiry);
                }
                else if(res.data.length === 0){ setReviewBoards({}); setInquiryBoards({}); }
            })
            .catch(err => console.log(err))
    },[]));

    //상품코드, 상품명, 수량
    let addProduct = () => {
        let item = {
            pcode : product.pcode,
            pname : product.pname,
            price : product.price,
            images: product.images,
            quantity : quantity,
        }
        dispatch(addBasket(item));
    }

    let goingToBuy = useCallback((product)=>{
        history.push({
            pathname:`/order/payment`,
            props:{
                buyingList : [{
                    pname: product.pname,
                    quantity: 1,
                    price: product.price,
                    images: product.images
                }],
                totalPrice : product.price
            }
        });
    },[]);

    const forBuying = (
        <Card body inverse style={{padding: 0, backgroundColor:"skyblue"}}>
            <CardBody>
                <Row className="text-center">
                    <Col xs="auto">
                        수량
                        <ButtonGroup size="sm" className="mb-2" >
                            <Button onClick={()=>{ if(quantity === 1) return; setQuantity(prevQuantity => prevQuantity-1 );}} >-1</Button>
                            <Input value={quantity} style={{width:"30px", padding:0, textAlign:"center"}} disabled/>
                            <Button onClick={()=>{setQuantity(prevQuantity => prevQuantity+1 );} } >+1</Button>
                        </ButtonGroup>
                    </Col>
                    <Col xs="auto">
                        <CardTitle tag="h5" className="mb-2" > 총 금액 {product.price * quantity} 원 </CardTitle>
                    </Col>
                </Row>
                <Button onClick={()=>{goingToBuy(product);}} size="md" style={{backgroundColor:"#FFF", color:"#000"}}>구매하기</Button>{'  '}
                <Button id="goBasket" onClick={()=> { addProduct();}}  size="md"  style={{backgroundColor:"#FFF", color:"#000"}} >장바구니 담기</Button>
                {/*<TooltipContent props={{text: "장바구니에 물건을 추가했습니다.", target:"goBasket"}}/>*/}
            </CardBody>
        </Card>

    )

    let badge = (sales) =>{
        let text = "";
        if(sales < 10) text = "신상품";
        else if(sales < 50) text = "인기상품";
        else if(sales < 100) text = "주문폭주";
        else if(sales < 200) text = "품절대란";

        return text;
    }

    let changeStars = (rating) =>{
        // let feeling = ['  별로에요','  나쁘지않아요','  괜찮아요','  좋아요','  최고에요'];
        let star = '⭐';
        let ratingStar = '';
        for(let i=1; i<=rating; i++){ ratingStar += star; }
        // ratingStar += feeling[rating-1];

        return ratingStar;
    }

    const reviewBoard = reviewBoards.length > 0 && reviewBoards.map((board, i)=>(
        <Table key={i} striped>
            <tbody>
                <tr>
                    <td colSpan="2" className="text-left"><strong>{board.title}</strong></td>
                    <td className="text-left" >평점: {changeStars(board.rating)}</td>
                    <td className="text-right" >작성자: {board.cid} 작성일: {board.bdate}</td>
                </tr>
                <tr>
                    <td colSpan="3" className="text-left">{board.content}</td>
                    <td className="text-right"><img src="http://placehold.it/70x70" alt=""/> </td>
                </tr>
            </tbody>
        </Table>
    ));

    const Review = (
        <div id="review" style={{marginTop: "20px"}}>
            <Row>
                <Col tag="h4" className="text-left">
                    리뷰 ({reviewBoards.length})
                    만족도 {changeStars(product.rating)} {product.rating}
                </Col>
            </Row>
            <hr/>
            {reviewBoards.length > 0 ? reviewBoard :  <strong>아직 후기가 없어요. 후기를 남겨주세요</strong>}
        </div>
    );

    let goInquiryPage = (pcode)=>{
        history.push({
            pathname: "/board/inquiry",
            pcode: pcode
        });
    }

    const inquiryBoard = inquiryBoards.length > 0 && inquiryBoards.map((board,i)=>(
        <tr key={i}>
            <td>{board.detailCategory}</td>
            <td>{board.title}</td>
            <td colSpan={2}>{board.content}</td>
            <td>{board.cid}</td>
            <td>{board.bdate}</td>
        </tr>
    ))

    const Inquiry = (
        <div id="inquiry" style={{marginTop: "20px"}}>
            <Row>
                <Col sm={9} style={{textAlign:"left", fontWeight:"bold", fontSize:"larger"}}> 문의 ({inquiryBoards.length})</Col>
                <Col sm={3}> <Button onClick={()=>{ goInquiryPage(product.pcode); }}>문의하기</Button></Col>
            </Row>
            <Table striped bordered>
                <thead>
                <tr>
                    <th>분류</th>
                    <th>제목</th>
                    <th colSpan={2}>내용</th>
                    <th>작성자</th>
                    <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                {inquiryBoard.length > 0 ? inquiryBoard :  <tr><td colSpan={6}>문의글이 존재하지 않습니다.</td></tr>}
                </tbody>
            </Table>
        </div>
    );

    return (
        <div className="container" style={{position: "relative", margin: "0 auto"}}>
            <Row style={{marginBottom: "50px"}}>
                <Col md={7}>
                    <Image src={ `/${product.images}` } style={{width:'100%', height:'100%', minWidth:'250px', maxWidth:'400px'}} />
                </Col>
                <Col id="detailTop">
                    <div className="text-left" style={{fontWeight:"bold", marginLeft:"10px"}}>
                        <h2 className="pt-5"> <Badge color="primary">{badge(Number(product.sales))}</Badge> {product.pname}</h2>
                        <hr/>
                        <h3 >{ product.price }원</h3>
                        <p>{product.description}</p>
                        <p>
                            평점 {changeStars(product.rating)}( {product.rating} )
                            리뷰 {reviewBoards.length}개
                        </p>
                        <p>{product.sales}개 구매 중</p>
                        <hr/>
                    </div>
                    <Row className="text-center">
                        <Col xs="auto">
                            수량
                            <ButtonGroup size="sm" className="mb-2" >
                                <Button onClick={()=>{ if(quantity === 1) return; setQuantity(prevQuantity => prevQuantity-1 );}} >-1</Button>
                                <Input value={quantity} style={{width:"30px", padding:0, textAlign:"center"}} disabled/>
                                <Button onClick={()=>{setQuantity(prevQuantity => prevQuantity+1 );} } >+1</Button>
                            </ButtonGroup>
                        </Col>
                        <Col style={{fontWeight:"bold"}}>
                            총 상품 금액
                            <span style={{color:"red", fontSize:"180%"}}> {product.price * quantity}</span>
                            원
                        </Col>
                    </Row>
                    <hr/>
                    <Row>
                        <Col xs="auto">
                            <Button onClick={()=>{goingToBuy(product);}} size="lg" color="success">구매하기</Button>{'  '}
                        </Col>
                        <Col xs="auto">
                            <Button id="goBasket" onClick={()=> { addProduct();}}  size="lg" color="info" >장바구니 담기</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/*<div id="sideNav"*/}
            {/*     style={{position: "absolute" , right: "3px", border: "1px solid gray", backgroundColor: "skyblue", height: "30vh", zIndex:"1"}}*/}
            {/*>*/}
            {/*    {forBuying}*/}
            {/*</div>*/}
            <div id="detailHeader" className="detailHeader" style={{width:"100%"}}>
                <Tabs fill justify defaultActiveKey={index} onSelect={(i) => setIndex(i)} id="uncontrolled-tab-example">
                    {/*****상세 설명 탭*****/}
                    <Tab eventKey="0" title="상세설명">
                        <div id="productImages" className="col-xl-7" >
                            <br/>
                            <img src="http://placehold.it/800x1000" alt="상품설명사진예정"/>
                            <br/>
                            상품설명이 가득가득 <br/>
                            사진도 있을걸...
                        </div>
                        <CommonPI product={product} />
                        {Review}
                        <hr/>
                        {Inquiry}
                    </Tab>
                    {/*****후기 탭*****/}
                    <Tab eventKey="1" title="후기">
                        {Review}
                    </Tab>
                    {/*****문의 탭*****/}
                    <Tab eventKey="2" title="문의">
                        {Inquiry}
                    </Tab>
                    {/*****상품고시 탭*****/}
                    <Tab eventKey="3" title="상품고시">
                        <CommonPI product={product} />
                    </Tab>
                </Tabs>
            </div>

        </div>
    )
}



export default ProductDetail;