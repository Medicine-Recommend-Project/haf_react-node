import {useDispatch, useSelector} from "react-redux";
import {deleteAll, deleteIt, deleteThis} from "../../store/actions/basketActions";
import React, {useCallback, useEffect, useState} from "react";
import {changeQuantity} from "../../store/actions/basketActions";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Col, Input, Row, Table} from "reactstrap";

function Basket({history}) {
    let baskets = useSelector((store)=>store.basketReducer.basket);
    let dispatch = useDispatch();

    const [checkProduct, setCheckProduct] = useState([]);
    const [allCheck, setAllCheck] = useState(true);
    const [pcodeList, setPcodeList] = useState([])
    const [quantity, setQuantity] = useState([]);
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
        setTotalPrice(baskets.reduce((total, product, i)=>{ if(pcodeList.includes(product.pcode)){ total+= product.price * quantity[i]; } return total;},0));
    },[checkProduct]); //checkProduct가 변할때마다 실행

    //개별적인 상품 체크박스 핸들러
    let checkboxHandler = (e, product)=>{
        if( e.target.checked && !pcodeList.includes(product.pcode)){
            setCheckProduct([...checkProduct, product]);
            setPcodeList([...pcodeList, product.pcode])
        } else{
            setCheckProduct(checkProduct.filter((el)=> el.pcode !== product.pcode));
            setPcodeList(pcodeList.filter((el)=> el !== product.pcode));
        }
    };
    //전체 상품 선택 및 해제 핸들러
    let allCheckHandler = (e)=>{
        if(e.target.checked){
            setAllCheck(true);
            setCheckProduct(baskets);
            setPcodeList(baskets.reduce((pcl,pd) => { pcl.push(pd.pcode); return pcl;},[]));
            setQuantity(baskets.reduce((quantity,pd)=> { quantity.push(pd.quantity); return quantity;},[]));
        } else{
            setAllCheck(false);
            setCheckProduct([]);
            setPcodeList([]);
            setTotalPrice(0)
        }
    }
    //수량 조절 핸들러
    let quantityButtonHandler = (index, product, number) =>{
        let q = [...quantity];
        if(q[index] === 1 && number === -1){ return; }  //현재 수량이 1인데 감소하려고하면 return;

        q[index] += number; //해당 인덱스와 동일한 수량 state의 수량 변경
        setQuantity(q);

        //체크되어있는 상품의 수량을 변경 시 총 금액 변경 (여기서 q[i]인 이유. quantity state가 즉시 반영 되기 전이기 때문에... 직접 수정한 복사본 q로 수정하는게 더 정확함)
        setTotalPrice(baskets.reduce((total, product, i)=>{ if(pcodeList.includes(product.pcode)){ total+= product.price * q[i]; } return total;},0));

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
                <input type="checkbox" onChange={event => checkboxHandler(event,product)}
                       checked={pcodeList.includes(product.pcode)}
                />
            </td>
            <td>{i}</td>
            <td onClick={()=>{history.push(`/product/detail/${product.pcode}`);}} style={{cursor:"pointer"}}>
                <Row >
                    <Col sm={3}>
                        <img src={ `/${product.images}` } width={70} height={70} alt="상품 미리보기"/>
                    </Col>
                    <Col sm={5} className="text-md-left">
                        {product.pname}
                    </Col>
                </Row>
            </td>
            <td>
                <Button onClick={()=>{dispatch(deleteIt(product.pcode));}} close />
            </td>
            <td>
                <ButtonGroup size="sm">
                    <Button onClick={()=> { quantityButtonHandler(i, product, -1); }}> - </Button>
                    <Input value={product.quantity} disabled bsSize="sm" style={{width:"40px", textAlign:"center"}}/>
                    <Button onClick={()=> { quantityButtonHandler(i, product, 1); }}> + </Button>
                </ButtonGroup>
            </td>
            <td>
                <span className="font-weight-bold" style={{color:"cornflowerblue"}}>{product.price * product.quantity}</span>원{'  '}
                <Button
                    onClick={()=>{history.push({
                        pathname:`/order/payment`,
                        props:{
                            buyingList : [{
                                pname: product.pname,
                                quantity: product.quantity,
                                price: product.price,
                                images: product.images
                            }],
                            totalPrice : product.price * product.quantity
                        }})}}
                    color="success"
                >구매하기</Button>
            </td>
        </tr>
    ));

    let goToBuy = ()=>{
        if(checkProduct.length <= 0) {
            alert('상품을 선택해주세요.');
            return;
        }

        history.push({
            pathname:`/order/payment`,
            props:{
                buyingList : checkProduct,
                totalPrice : totalPrice
            }
        })
    }

    return(
        <div>
            <h1>장바구니</h1>
            {( baskets.length === 0 ? <strong>장바구니에 담긴 상품이 존재하지 않습니다.</strong> : (
                <div id="basketTable">
                    <Table hover striped >
                        <thead>
                        <tr>
                            <th colSpan={5} className="text-left">
                                선택({checkProduct.length}/{baskets.length})
                            </th>
                            <td>
                                <Button onClick={()=>checkDelete()} outline>선택상품 삭제</Button>
                                {'   '}
                                <Button onClick={()=>dispatch(deleteAll())} outline color="danger">전체 삭제</Button>
                            </td>
                        </tr>
                            <tr>
                                <th>
                                    <input type="checkbox" onChange={allCheckHandler} checked={allCheck}/>
                                </th>
                                <th colSpan={3}>상품</th>
                                <th>수량</th>
                                <th>상품금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {basketList}
                        </tbody>
                    </Table>

                    <Table bordered>
                        <tr style={{border:"3px solid black", fontSize:"150%", fontWeight:"bold"}}>
                            <td>
                                결제 예상 금액
                            </td>
                            <td>
                                {totalPrice} 원
                                + 배송비 {(totalPrice >= 100000 ? <span className="text-danger" >0</span> : <span className="text-danger">2500</span>)} 원
                            </td>
                            <td className="text-left">
                                <span style={{color:"cornflowerblue", fontSize:"120%"}}>{(totalPrice >= 100000 ? totalPrice : totalPrice+2500)}</span> 원
                            </td>
                        </tr>
                    </Table>
                    <div style={{marginBottom:"30px"}}>
                        <Button onClick={()=>{goToBuy();}}
                            size="lg"
                            color="success"
                            style={{width:"30%"}}
                        >구매하기</Button>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default Basket;