/* eslint-disable */
import React, {useCallback, useEffect, useState} from 'react'
import axios from 'axios'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardFooter, Button, Badge, Pagination
} from 'reactstrap';
import {addBasket} from "../../store/actions/basketActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import CarouselImages from "../home/calrouselImages";

function ProductMain() {
    let dispatch = useDispatch();
    let history = useHistory();
    const [Products, setProducts] = useState({});
    const [pageNum, setPageNum] = useState([]);
    const [page, setPage] = useState({
        currentPage : 1,
        endPage : 1,
        showDataCount : 5
    });

    useEffect(()=>{
        movePage(page.currentPage, page.showDataCount);
    }, [page.currentPage, page.showDataCount]);

    //페이지 이동
    let movePage = (currentPage, showDataCount) =>{
        let url = '/api/product/products' ;
        let data = {
            currentPage: currentPage,
            showDataCount: showDataCount
        }
        axios.post(url, data)
            .then(res =>{
                if(res.data.products.length > 0) {
                    let pn = [];
                    setProducts(res.data.products);
                    setPage({...page, endPage: res.data.endPage});

                    for(let i = 0; i < res.data.endPage; i++){
                        pn.push(i+1);
                    }
                    setPageNum(pn);
                }
                else alert("상품 데이터 가져오기 실패!")
            })
    }

    // 상세페이지 이동
    let productDetail = useCallback((pcode)=>{ history.push(`/product/detail/${pcode}`); } ,[Products]);

    let goToBasket = (product) => {
        addProduct(product);
        alert(product.pname + '상품을 장바구니에 담았습니다.');
    }

    //상품코드, 상품명, 수량
    let addProduct = (product) => {
        let item = {
            pcode : product.pcode,
            pname : product.pname,
            price : product.price,
            images: product.images,
            quantity : 1,
        }
        dispatch(addBasket(item));
    }

    // 바로 구매하기
    let goingToBuy = useCallback((product)=>{
        history.push({
            pathname:`/order/payment`,
            props:{
                buyingList : [{
                    pcode: product.pcode,
                    pname: product.pname,
                    quantity: 1,
                    price: product.price,
                    images: product.images
                }],
                totalPrice : product.price
            }
        });
    },[]);

    // 뱃지 달기
    let badge = (sales) =>{
        let text = "";
        if(sales < 10) text = "신상품";
        else if(sales < 50) text = "인기상품";
        else if(sales < 100) text = "주문폭주";
        else text = "품절대란";

        return text;
    }

    // 상품 카드
    const Cards = Products.length > 0 && Products.map((product, i)=> {
        return(
            <div key={i} style={{margin:"10px"}}>
                {i+1}
                <Card style={{width: "250px"}}>
                    <CardImg src={ `${product.images}` } onClick={()=>{productDetail(product.pcode);}} top width="100%" className="mt-2" alt="Card image cap"  style={{ height:'20vh', minWidth:'130px', maxHeight:'200px'}} />
                    <CardBody onClick={()=>{productDetail(product.pcode);}} style={{padding:"10px"}}>
                            <Badge color="primary">{badge(Number(product.sales))}</Badge>
                        <CardTitle style={{fontSize:"140%", fontWeight:"bold"}}>
                            {product.pname }
                        </CardTitle>
                        <CardText className="mb-2 ">{ product.description } </CardText>
                        <CardSubtitle className="mb-2 text-muted">⭐{product.rating} 구매: {product.sales}</CardSubtitle>
                        <CardText tag="h5">{ product.price }원</CardText>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={()=>{goingToBuy(product);}} size="sm" outline color="success">구매</Button>{' '}
                        <Button onClick={()=>{goToBasket(product);}} size="sm" outline color="info">장바구니</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    });

    // 상품 n개씩 보기
    // let changeShowData = (max) =>{
    //     let op = [];
    //     for(let i = 5; i<=max; i*=5){
    //         op.push(<option value={i} onClick={()=>{setPage({...page, showDataCount: i})}}>{i}개씩 보기</option>);
    //     }
    //     return op;
    // }

    let changeShow = (e) =>{
        let val = Number(e.target.value)
        setPage({...page, showDataCount: val});
    }

    // 페이징
    const makePageNav = pageNum.map((val) => {
        return <li
                key={"page"+val}
                style={{display:"inline-block", listStyle:"none", padding:"3px", fontSize:"30px", cursor:"pointer"}}
                onClick={()=>{setPage({...page, currentPage: val})}}
                >{val}</li>
    });

    return (
        <div style={{margin:'0 auto'}}>
            <CarouselImages/>
            <div className="text-center mt-5">
                <h2>Medicine</h2>
                <select name="showData" value={page.showDataCount} onChange={changeShow}>
                    {/*{changeShowData(30)}*/}
                    <option value={5}>5개씩 보기</option>
                    <option value={10}>10개씩 보기</option>
                    <option value={15}>15개씩 보기</option>
                    <option value={20}>20개씩 보기</option>
                </select>
            </div>
            <div className="container row mx-auto">
                { Cards }
            </div>
            <div>
                <ul>
                    { makePageNav }
                </ul>
            </div>
        </div>
    );
}

export default ProductMain;