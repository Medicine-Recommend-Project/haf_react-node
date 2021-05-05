import {useDispatch, useSelector} from "react-redux";
import {deleteIt, deleteThis} from "../../store/actions/basketActions";
import React, {useCallback, useEffect, useState} from "react";
import {changeQuantity} from "../../store/actions/basketActions";
import {Link} from "react-router-dom";

function Basket({history}) {
    let baskets = useSelector((store)=>store.basketReducer.basket);
    let dispatch = useDispatch();

    const [checkProduct, setCheckProduct] = useState([]);
    const [allCheck, setAllCheck] = useState(true);
    const [pcodeList, setPcodeList] = useState([])
    const [quantity, setQuantity] = useState({});
    //총 금액
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()=> {
        setCheckProduct(baskets);
        setPcodeList( baskets.reduce((pcl,pd) => { pcl.push(pd.pcode); return pcl;},[]) );
        setQuantity(baskets.reduce((quantity,pd)=> { quantity.push(pd.quantity); return quantity;},[]));
    },[baskets]);

    useEffect(()=> {
        if(checkProduct.length === baskets.length){ setAllCheck(true) }
        else{ setAllCheck(false) }
        setTotalPrice(checkProduct.reduce((totalPrice, product)=>{ return totalPrice + product.price * product.quantity },0));
    },[checkProduct]); //checkProduct가 변할때마다 실행

    let checkboxHandler = (e, product)=>{
        if( e.target.checked && !pcodeList.includes(product.pcode)){
            setCheckProduct([...checkProduct, product]);
            setPcodeList([...pcodeList, product.pcode])
        } else{
            setCheckProduct(checkProduct.filter((el)=> el.pcode !== product.pcode));
            setPcodeList(pcodeList.filter((el)=> el !== product.pcode))
        }
    };

    let allCheckHandler = (e)=>{
        if(e.target.checked){
            setAllCheck(true);
            setCheckProduct(baskets);
            let pcl = [];
            baskets.map(pd => pcl.push(pd.pcode));
            setPcodeList(pcl);
        }
        else{
            setAllCheck(false);
            setCheckProduct([]);
            setPcodeList([]);
        }
    }
    //수량 조절 핸들러
    let quantityButtonHandler = (index, product, number) =>{
        let q = [...quantity];
        if(q[index] === 1 && number === -1){ return; }
        q[index] += number; //해당 인덱스와 동일한 수량 state의 수량 변경
        setQuantity(q);
        dispatch(changeQuantity(product.pcode, q[index]));
    }

    //선택 상품들 장바구니 삭제 버튼
    let checkDelete = () =>{
        let pcodes = checkProduct.reduce((arr, product) => {arr.push(product.pcode); return arr;},[]);
        dispatch(deleteThis([pcodes]));
    }

    //장바구니 목록관리
    const basketList = baskets && baskets.map((product, i) => (
        <tr key={i}>
            <td>
                <input type="checkbox" onChange={event => checkboxHandler(event,product)} checked={(pcodeList.includes(product.pcode) ? true : false)} />
            </td>
            <td>{i}</td>
            <td onClick={()=>{history.push(`/product/detail/${product.pcode}`);}}>
                <img src="http://placehold.it/50x50" alt="상품 미리보기"/>
                {product.pname}
            </td>
            <td><button onClick={()=>{dispatch(deleteIt(product.pcode));}}>x</button></td>
            <td>
                <button onClick={()=> { quantityButtonHandler(i, product, -1); }}> - </button>
                {product.quantity}
                <button onClick={()=> { quantityButtonHandler(i, product, 1); }}> + </button>
            </td>
            <td>{product.price * product.quantity}</td>
        </tr>
    ));


    return(
        <div>
            <h1>장바구니</h1>
            {( baskets.length === 0 ? <strong>장바구니에 담긴 상품이 존재하지 않습니다.</strong> : (
                <div id="basketTable">
                    <table style={{width:"100%", border:"1px solid blue"}}>
                        <thead>
                        <tr>
                            <td colSpan={5} style={{textAlign:"left"}}>
                                    선택({checkProduct.length}/{baskets.length})
                            </td>
                            <td>
                                    <button onClick={()=>checkDelete()}>선택상품 삭제</button>

                            </td>
                        </tr>
                            <tr style={{width:"100%", border:"1px solid blue"}}>
                                <th>
                                    <input type="checkbox" onChange={allCheckHandler} checked={allCheck}/>
                                </th>
                                <th>번호</th>
                                <th colSpan={2}>상품</th>
                                <th>수량</th>
                                <th>총금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {basketList}
                        </tbody>
                    </table>
                    <p>
                        <span style={{fontWeight:"bold"}}>결제 예상 금액</span>
                        <Link to={{
                            pathname:`/order/payment`,
                            props:{
                                buyingList : checkProduct,
                                totalPrice : totalPrice
                            }
                        }}>구매하기</Link>
                    </p>
                    <p>
                    총 금액 {totalPrice} 원
                    + 배송비 {(totalPrice >= 100000 ? <span>0</span> : <span>2500</span>)} 원
                    = {(totalPrice >= 100000 ? totalPrice : totalPrice+2500)} 원
                    </p>
                </div>
            ))}
        </div>
    );
}

export default Basket;