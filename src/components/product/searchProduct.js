/* eslint-disable */
import React, {useCallback, useEffect, useState} from 'react'
import axios from 'axios'
import { Jumbotron } from 'react-bootstrap';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardFooter, Button
} from 'reactstrap';
import {addBasket} from "../../store/actions/basketActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import CarouselImages from "../home/calrouselImages";

function SearchProduct({location}) {
    let dispatch = useDispatch();
    let history = useHistory();
    const [Products, setProducts] = useState({});

    useEffect(()=>{
        setProducts(location.product);
    }, [location]);

    let productDetail = useCallback((pcode)=>{ history.push(`/product/detail/${pcode}`); } ,[]);

    let goToBasket = useCallback((product) => {
        addProduct(product);
        alert(product.pname + '상품을 장바구니에 담았습니다.');
    } ,[])

    //상품코드, 상품명, 수량
    let addProduct = useCallback((product) => {
        let item = {
            pcode : product.pcode,
            pname : product.pname,
            price : product.price,
            images: product.images,
            quantity : 1,
        }
        dispatch(addBasket(item));
    })

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

    const Cards = Products.length > 0 && Products.map((product, i)=> {
        return(
                <div key={i} style={{margin:"10px"}}>
                    <Card style={{maxWidth: "230px"}}>
                        {/*<img src={ `http://localhost:3001/${product.images}` } style={{width:'15vw', height:'20vh', minWidth:'130px', maxHeight:'150px'}} />*/}
                        <CardImg onClick={()=>{productDetail(product.pcode);}} top width="100%" src={ `/${product.images}` } alt="Card image cap"  style={{ height:'20vh', minWidth:'130px', maxHeight:'200px'}} />
                        <CardBody onClick={()=>{productDetail(product.pcode);}} style={{padding:"10px"}}>
                            <CardTitle style={{fontSize:"140%", fontWeight:"bold"}}>{ product.pname }</CardTitle>
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
    })

    return (
        <div style={{margin:'0 auto'}}>
            <CarouselImages/>
            <div style={{textAlign:'center'}}>
                <h2>검색 결과</h2>
                <hr/>
            </div>
            <div className="container row" style={{margin:"0 auto"}}>
                { (Products.length > 0 ? Cards : <h3>검색 결과가 없어요.</h3>) }
            </div>
        </div>
    );
}

export default SearchProduct;