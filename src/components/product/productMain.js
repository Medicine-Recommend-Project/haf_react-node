/* eslint-disable */
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { Button,Jumbotron } from 'react-bootstrap';
import {addBasket} from "../../store/actions/basketActions";
import {useDispatch} from "react-redux";

function ProductMain({history}) {
    let dispatch = useDispatch();
    const [Products, setProducts] = useState({});

    useEffect(()=>{
        let url = '/product/products' ;
        axios.get(url)
            .then(res =>{
                // console.log(res.data);
                if(res.data.length > 0) setProducts(res.data);
                else alert("상품 데이터 가져오기 실패!")
            })
    }, []);


    let productDetail = (pcode)=>{ history.push(`/product/detail/${pcode}`); }

    //상품코드, 상품명, 수량
    let addProduct = (product) => {
        let item = {
            pcode : product.pcode,
            pname : product.pname,
            price : product.price,
            quantity : 1,
        }
        dispatch(addBasket(item));
    }

    const Card = Products.length > 0 && Products.map((product, i)=> {
        return(
                <div className="col-md-3" key={i} style={{border: "1px solid pink"}}>
                    <div onClick={()=>{productDetail(product.pcode);}} style={{border: "1px solid blue"}}>
                        {/*<img src={ `http://localhost:3001/${product.images}` } style={{width:'15vw', height:'20vh', minWidth:'130px', maxHeight:'150px'}} />*/}
                        <img src="http://placehold.it/500x500" style={{width:'15vw', height:'20vh', minWidth:'130px', maxHeight:'200px'}} />
                        <h4>{ product.pname }</h4>
                        <p>{ product.description }</p>
                        <p>{ product.price }원</p>
                        <p>평점 ( {product.rating} ) {product.sales}개 구매 </p>
                    </div>
                    <button className="btn btn-danger" onClick={()=>{history.push({
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
                    })}}>구매하기</button>
                    <button className="btn btn-danger" onClick={()=>{addProduct(product);}}>장바구니 담기</button>
                </div>
        );
    })

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>

            <Jumbotron className="background">
                <h1>20% Season OFF</h1><br/>
                <p>
                    <Button variant="primary">주문하러 가기</Button>
                </p><br/>
                <p>
                    특별 가격은 해당 제품 첫 주문시 계정당 1개, 제품 당 1개, 주문 당 1개에만 적용됩니다.<br/>
                    만약 한 주문에서 동일 특가 상품을 1개 이상 주문하면 장바구니에서 자동으로 1개만 세일가가 적용됩니다.<br/>
                    중복 할인은 적용되지 않으며 체험특가 선택은 장바구니에서도 가능합니다.<br/>
                </p>
            </Jumbotron>

            <div style={{textAlign:'center'}}>
                <h2>Medicine</h2>
            </div>
            <div className="container">
                <div className="row">
                    { Card }
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'center'}}>
                <button onClick={e=>{e.preventDefault()}}>더보실라우?</button>
            </div>
        </div>
    );
}

export default ProductMain;