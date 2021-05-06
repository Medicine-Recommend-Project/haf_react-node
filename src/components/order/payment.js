import {useDispatch} from "react-redux";
import {buyProduct} from "../../store/actions/basketActions";
import { useHistory } from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import DaumPostcodeAPI from "../home/DaumPostcodeAPI";

function Payment({location}) {
    let dispatch = useDispatch();
    let history = useHistory();
    const regNumOnly = /[^0-9]/g;   //숫자가 아닌 것

    const [buyingList, setBuyingList] = useState({});
    const [user, setUser] = useState({});
    const [point, setPoint] = useState({ usePoint: 0, checked: false });
    const [agree, setAgree] = useState(true)
    const [open, setOpen] = useState(false);    //다음 주소api를 팝업처럼 관리하기 위함
    const [deliveryInfo, setDeliveryInfo] = useState({recipient: "", zonecode: "", address: "", detailAddress: ""})
    const totalPrice = location.props.totalPrice - point.usePoint;

    useEffect( ()=> {
        setOpen(false);
        setAgree(true);
        setBuyingList(location.props.buyingList);
    },[]);

    //로그인 된 아이디로 유저정보 검색해오기
    useEffect( ()=>{
        let url = '/customer/userinfo';
        axios.post(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.replace('/customer/login'); //로그인하고나면 장바구니 화면으로 가야돼서 history에 기록을 남기지 않기 위해서 replace()사용!
                }
                let userData = {...res.data};
                setUser(userData);
                setDeliveryInfo({...deliveryInfo, zonecode: userData.zonecode, address: userData.address, detailAddress: userData.detailAddress})
            })
            .catch(err => console.log(err))
    },[]);

    let onTyping = (e)=> {
        setDeliveryInfo({...deliveryInfo, [e.target.name]: e.target.value});
    }// end of onTyping()

    let pointHandler = (e)=>{
        if(e.target.name === 'usePoint'){
            let value = e.target.value.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌
            if(point.usePoint === "0" && e.target.value === "00"){ value = "0" }
            if(value > user.point){ value = user.point }
            setPoint({ ...point, [e.target.name]: value, checked: false });
        }else if(e.target.checked){
            setPoint({...point,  usePoint: user.point, checked: true});
        }else if(!e.target.checked){
            setPoint({...point,  usePoint: 0, checked: false})
        }
    }

    //장바구니 목록관리
    const buying = buyingList.length>0 && buyingList.map((product, i) => (
        <tr key={i}>
            <td>{i}</td>
            <td>
                <img src="http://placehold.it/50x50" alt="상품 미리보기"/>
                {product.pname}
            </td>
            <td>
                {product.quantity}
            </td>
            <td>{product.price * product.quantity}</td>
        </tr>
    ));

    let daumHandler = (data) => {
        let api = {...data};
        setDeliveryInfo({...deliveryInfo, address: api.fullAddress, zonecode : api.zonecode, detailAddress: ""});
        setOpen(false);
    };

    let agreement = (e)=>{
        if(e.target.checked){ setAgree(false); }
        else{ setAgree(true); }
    };

    let buyingProducts = async() =>{
        let totalQuantity = buyingList.reduce((tQuantity, product)=>{return tQuantity+=product.quantity},0)
        let url = '/order/buying';
        let data = {
            buyingList: buyingList,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice,
            deliveryInfo: deliveryInfo,
            usePoint: point.usePoint,
        };
        axios.post(url, data)
            .then(res => {
                if(res.data === 'success'){
                    alert('구매가 완료되었습니다.');
                    // console.log('구매 시 보내는 리스트 : ', buyingList)
                    dispatch(buyProduct([buyingList]));
                    history.push('/order/paymentDetails');
                }else if(res.data === 'false'){
                    alert('결제 실패. 다시 시도해주세요.');
                }else {
                    alert('문제가 발생했습니다.');
                }
            })
            .catch(err => console.log(err))
    }

    return(
        <div>
            <h1>결제화면</h1>
            <table style={{width:"100%", border:"1px solid blue"}}>
                <thead>
                <tr style={{width:"100%", border:"1px solid blue"}}>
                    <th>번호</th>
                    <th>상품</th>
                    <th>수량</th>
                    <th>총금액</th>
                </tr>
                </thead>
                <tbody>
                {buying}
                </tbody>
            </table>
            <p>
                <span style={{fontWeight:"bold"}}>결제 예정 금액 {totalPrice}원</span>
            </p>
            <div id="sideNav"
                 style={{position: "absolute" , right: "3px", border: "1px solid gray", backgroundColor: "skyblue", height: "30vh", zIndex:"1"}}
            >
                결제 금액 {totalPrice}원<br/>
                <hr/>
                상품 할인 금액 0원 <br/>
                배송비 {(totalPrice >= 100000 ? 0 : 2500)}원<br/>
                적립금 사용 {point.usePoint} 원<br/>
                <hr/>
                최종 결제 금액 {(totalPrice >= 100000 ? totalPrice : totalPrice+2500)} 원
            </div>
            <div id="pointDiv">
                <h3>쿠폰 및 적립금 사용</h3>
                <hr/>
                <table id="pointTable">
                    <tbody>
                    <tr>
                        <td>쿠폰 적용</td>
                        <td>적용 가능 쿠폰이 없습니다.</td>
                    </tr>
                    <tr>
                        <td>적립금 사용</td>
                        <td>
                            <input type="text" name="usePoint" value={point.usePoint} onChange={pointHandler}/>원
                            <input type="checkbox" onClick={pointHandler} checked={point.checked} placeholder="0"/>모두 사용 <br/>
                            보유 적립금 : {user.point}원 (사용 가능: {user.point - point.usePoint})
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div> {/*end of 쿠폰, 적립금 div*/}
            <div id="addressDiv">
                <h3>배송지 정보</h3>
                <hr/>
                <table id="addressTable">
                    <tbody>
                    <tr>
                        <td>수령인</td>
                        <td><input type="text" name="recipient" onChange={onTyping}/></td>
                    </tr>
                    <tr>
                        <td>연락처</td>
                        <td>{user.ph}</td>
                    </tr>
                    <tr>
                        <td>배송지 선택</td>
                        <td>
                            <input type="radio" value="나의 배송지" checked={true}/>나의 배송지
                            <input type="radio" value="새 배송지"/> 새 배송지
                        </td>
                    </tr>
                    <tr>
                        <td>배송지 주소</td>
                        <td><button onClick={() => { setOpen(true); }}> 주소 검색</button></td>
                        { open ? <DaumPostcodeAPI handler={daumHandler}/> : null }
                    </tr>
                    <tr>
                        <td></td>
                        <td>{deliveryInfo.zonecode} {deliveryInfo.address}</td>
                    </tr>
                    <tr>
                        <td></td>

                        <td><input type="text" name="detailAddress" value={deliveryInfo.detailAddress} onChange={onTyping}/></td>

                    </tr>
                    </tbody>
                </table>
            </div> {/*end of 배송지 div*/}
            <div id="pay">
                <h3>결제 방법</h3>
                <hr/>
                <p>
                    <input type="radio"/>카드 결제
                    <input type="radio"/>무통장 입금
                    <input type="radio"/>휴대폰 결제
                </p>
            </div> {/*end of 결제방법 div*/}
            <div id="agreement">
                <h3>개인정보 약관 동의</h3>
                <hr/>
                <p>
                    약관...
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </p>
                <input type="checkbox" onClick={agreement}/> 약관에 동의합니다.
            </div> {/*end of 개인정보 동의 div*/}
            <button onClick={()=>{ buyingProducts()}} disabled={agree}>구매하기</button>
        </div>
    );
}

export default Payment;