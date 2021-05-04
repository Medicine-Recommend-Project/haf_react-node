import React, { useCallback, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import CommonPI from "../home/commonProductInformations";
import {useDispatch} from "react-redux";
import {addBasket, deleteAll} from "../../store/actions/basketActions";

function ProductDetail({match, history}) {
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [reviewBoards, setReviewBoards] = useState({});
    const [inquiryBoards, setInquiryBoards] = useState({});

    let dispatch = useDispatch();

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

    //수량 + - 버튼 클릭 시 수량 조절
    let quantityHandler = (e, btnValue)=>{
        e.preventDefault();
        if(btnValue === '+'){
            setQuantity(prevQuantity => prevQuantity + 1 );
        }else if(btnValue === '-'){
            if(quantity === 1) return;
            setQuantity(prevQuantity => prevQuantity - 1 );
        }
    }
    //상품코드, 상품명, 수량
    let addProduct = () => {
        let item = {
            pcode : product.pcode,
            pname : product.pname,
            price : product.price,
            quantity : quantity,
        }
        dispatch(addBasket(item));
    }

    const forBuying = (
        <>
            수량
            {quantity}
            <button onClick={(e)=>{quantityHandler(e, '-')}}> - </button>
            <button onClick={(e)=>{quantityHandler(e, '+')}}> + </button>
            <h5> 총 금액 {product.price * quantity} 원 </h5>
            <button className="btn btn-danger" >구매하기</button>{'  '}
            <button className="btn btn-danger" onClick={addProduct}>장바구니 담기</button> <br/><br/>
            <button onClick={(e)=>{e.preventDefault(); dispatch(deleteAll());}}>임시 장바구니 다 비우기</button>
        </>
    )

    let changeStars = (rating) =>{
        let feeling = ['  별로에요','  나쁘지않아요','  괜찮아요','  좋아요','  최고에요'];
        let star = '⭐';
        let ratingStar = '';
        for(let i=1; i<=rating; i++){ ratingStar += star; }
        ratingStar += feeling[rating-1];
        return ratingStar;
    }

    const reviewBoard = reviewBoards.length > 0 && reviewBoards.map((board, i)=>(
        <table key={i} style={{border:"1px solid #000"}}>
            <tbody>
            <tr>
                <td>{changeStars(board.rating)}</td>
                <td>{board.title}</td>
                <td>{board.bdate}</td>
            </tr>
            <tr>
                <td colSpan="2">{board.content}</td>
                <td>{board.cid}</td>
            </tr>
            </tbody>
        </table>
    ));

    const inquiryBoard = inquiryBoards.length > 0 && inquiryBoards.map((board,i)=>(
        <tr key={i}>
            <td>{board.detailCategory}</td>
            <td>{board.title}</td>
            <td>{board.content}</td>
            <td>{board.cid}</td>
            <td>{board.bdate}</td>
        </tr>
    ))

    return (
        <div className="container" style={{position: "relative"}}>
            디테일 페이지
            <div className="row">
                <div className="col-lg-5">
                    <img src={ `http://localhost:3001/${product.images}` } style={{width:'100%', height:'100%', minWidth:'250px', maxWidth:'400px'}} />
                </div>
                <div id="detailTop" className="col-md-6 mt-4">
                    <h2 className="pt-5">{product.pname}</h2>
                    <hr/>
                    <p>{product.description}</p>
                    <p>평점 ( {product.rating} ) {product.sales}개 구매</p>
                    <p>{ product.price }원</p>
                    {forBuying}
                </div>
            </div>
            <div id="detailHeader" className="detailHeader">
                <ul>
                    <li><Link to={'#'}>상세설명</Link></li>
                    <li><Link to={'#'}>문의</Link></li>
                    <li><Link to={'#'}>후기</Link></li>
                    <li><Link to={'#'}>상품고시</Link></li>
                </ul>
            </div>
            <div id="sideNav"
                 style={{position: "absolute" , right: "3px", border: "1px solid gray", backgroundColor: "skyblue", height: "30vh", zIndex:"1"}}
            >
                {forBuying}
            </div>
            <div id="productImages" className="col-xl-7" >
                <img src="http://placehold.it/800x1000" alt="상품설명사진예정"/>
                <br/>
                상품설명이 가득가득 <br/>
                사진도 있을걸...
            </div>
            <hr/>
            <CommonPI product={product} />
            <hr/>
            <div id="review">
                리뷰 ({reviewBoards.length}) <span>만족도 {product.rating}</span><br/>
                <hr/>
                {reviewBoards.length > 0 ? reviewBoard :  <strong>아직 후기가 없어요. 후기를 남겨주세요</strong>}
            </div>
            <hr/>
            <div id="inquiry">
                문의 ({inquiryBoards.length}) <button onClick={(e)=>{e.preventDefault(); history.push("/board/inquiry");}}>문의하기</button>
                <table>
                    <thead>
                    <tr>
                        <th>분류</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {inquiryBoard.length > 0 ? inquiryBoard :  <tr><td>문의글이 존재하지 않습니다.</td></tr>}
                    </tbody>
                </table>
            </div>
            <hr/>
        </div>
    )
}



export default ProductDetail;