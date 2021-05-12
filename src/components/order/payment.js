import {useDispatch} from "react-redux";
import {buyProduct} from "../../store/actions/basketActions";
import { useHistory } from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DaumPostcodeAPI from "../home/DaumPostcodeAPI";
import {Button, Col, FormGroup, Input, Label, Row, Table} from "reactstrap";
import Terms from "../home/terms";

function Payment({location}) {
    let dispatch = useDispatch();
    let history = useHistory();
    const regNumOnly = /[^0-9]/g;   //숫자가 아닌 것
    const regPh1 = /^(\d{3})(\d)/;
    const regPh2 = /^(\d{3}-\d{4})(\d)/;

    const [buyingList, setBuyingList] = useState({});
    const [user, setUser] = useState({});
    const [point, setPoint] = useState({ usePoint: 0, checked: false });
    const [agree, setAgree] = useState(true)
    const [open, setOpen] = useState(false);    //다음 주소api를 팝업처럼 관리하기 위함
    const [deliveryInfo, setDeliveryInfo] = useState({recipient: "", ph: "",zonecode: "", address: "", detailAddress: "", method: "" })
    const [addr, setAddr] = useState(0);
    const [saveAddr, setSaveAddr] = useState(false);
    const totalPrice = location.props.totalPrice;
    const delFee = (totalPrice >= 100000 ? 0 : 2500);
    const finalTotalPrice = location.props.totalPrice - point.usePoint + delFee;

    useEffect( ()=> {
        setOpen(false);
        setAgree(true);
        setAddr(0);
        setSaveAddr(false);
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
                setDeliveryInfo({...deliveryInfo, ph: userData.ph, zonecode: userData.zonecode, address: userData.address, detailAddress: userData.detailAddress, method: "카드"})
            })
            .catch(err => console.log(err))
    },[]);

    let onTyping = (e)=> {
        if(e.target.name === "ph"){
            let value = e.target.value.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌
            //핸드폰 번호 중간에 - 넣어주기
            if (regPh1.test(value)) { value = value.replace(regPh1, '$1-$2'); }
            if (regPh2.test(value)) { value = value.replace(regPh2, '$1-$2'); }
            // - 들어간 번호를 다시 useState의 ph에 넣어주기
            setDeliveryInfo({ ...deliveryInfo, ph: value });
            return;
        }
        setDeliveryInfo({...deliveryInfo, [e.target.name]: e.target.value});
    }// end of onTyping()

    let pointHandler = (e)=>{
        let max = totalPrice + delFee;
        let value;
        if(e.target.name === 'usePoint'){
            value = e.target.value.replace(regNumOnly, ''); //숫자 외의 다른 문자가 들어오면 없애줌
            if(point.usePoint === "0" && e.target.value === "00"){ value = "0" }
            if(value > user.point){ value = user.point }
            if(value >= max ) { value = max }
            setPoint({ ...point, [e.target.name]: value, checked: false });
        }else if(e.target.checked){
            if(user.point >= max) { value = max }
            else value = user.point
            setPoint({...point,  usePoint: value, checked: true});
        }else if(!e.target.checked){
            setPoint({...point,  usePoint: 0, checked: false})
        }
    }

    let daumHandler = (data) => {
        let api = {...data};
        setDeliveryInfo({...deliveryInfo, address: api.fullAddress, zonecode : api.zonecode, detailAddress: ""});
        setOpen(false);
    };

    let methodHandler = (e)=>{
        if(e.target.checked){
            setDeliveryInfo({...deliveryInfo, method: e.target.value});
        }
    }

    let agreement = (e)=>{
        if(e.target.checked){ setAgree(false); }
        else{ setAgree(true); }
    };

    //구매 목록
    const buying = buyingList.length>0 && buyingList.map((product, i) => (
        <tr key={i}>
            <td>
                <Row>
                    <Col sm={3}>
                        <img src={ `/${product.images}` } width={70} height={70} alt="상품 미리보기"/>
                    </Col>
                    <Col className="text-left font-weight-bold">
                        {product.pname}
                        <br/>
                        <span className="text-muted">
                            {product.quantity} 개
                        </span>
                    </Col>
                </Row>
            </td>
            <td className="font-weight-bold" style={{fontSize:"120%", width:"200px"}}>{product.price * product.quantity} 원</td>
        </tr>
    ));

    let buyingProducts = () =>{
        for(let i in Object.keys(deliveryInfo)){
            // console.log(Object.keys(inputs)[i], ' : ', inputs[Object.keys(inputs)[i]]); // ← state의 key : value 값 console에 찍어줌
            if(deliveryInfo[Object.keys(deliveryInfo)[i]] === "" || deliveryInfo[Object.keys(deliveryInfo)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()
        let totalQuantity = buyingList.reduce((tQuantity, product)=>{ tQuantity+=product.quantity; return tQuantity; },0)
        let url = '/order/buying';
        let data = {
            buyingList: buyingList,
            totalQuantity: totalQuantity,
            totalPrice: totalPrice,
            deliveryInfo: deliveryInfo,
            usePoint: point.usePoint,
            saveAddr: saveAddr
        };
        axios.post(url, data)
            .then(res => {
                if(res.data.result === 'success'){
                    alert('구매가 완료되었습니다.');
                    // console.log('구매 시 보내는 리스트 : ', buyingList)
                    dispatch(buyProduct([buyingList]));
                    history.replace({
                        pathname: '/order/paymentDetails',
                        ocode: res.data.ocode
                    });
                }else if(res.data.result === 'false'){
                    alert('결제 실패. 다시 시도해주세요.');
                }else {
                    alert('문제가 발생했습니다.');
                }
            })
            .catch(err => console.log(err))
    }

    return(
        <div style={{width:"90%", margin:"50px auto 0"}}>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>상품</th>
                        <th>상품금액</th>
                    </tr>
                </thead>
                <tbody>
                    {buying}
                </tbody>
            </Table>
            <Table style={{marginBottom:"30px"}}>
                <tbody>
                <tr style={{border:"3px solid black", fontSize:"150%", fontWeight:"bold"}}>
                    <td width={300} className="text-left">
                        결제 예정 금액
                    </td>
                    <td colSpan={3} className="text-right">
                        <span style={{color:"cornflowerblue", fontSize:"150%"}}>{(totalPrice >= 100000 ? totalPrice : totalPrice+2500)}</span> 원
                    </td>
                </tr>
                </tbody>
            </Table>
            <div>
                <div id="pointDiv">
                    <h3 className="text-left">쿠폰 및 적립금 사용</h3>
                    <hr/>
                    <Table id="pointTable" bordered>
                        <tbody>
                        <tr>
                            <th scope="row" width={"20%"}>쿠폰 적용</th>
                            <td className="text-left">적용 가능 쿠폰이 없습니다.</td>
                        </tr>
                        <tr>
                            <th scope="row">적립금 사용</th>
                            <td  className="text-left">
                                <Row>
                                    <Col sm={3}>
                                        <Input type="text" name="usePoint" value={point.usePoint} onChange={pointHandler} placeholder="0"/>
                                    </Col>
                                    <Col sm={5} className="text-left">
                                        <input type="checkbox" onChange={pointHandler} checked={point.checked} /> 모두 사용
                                    </Col>
                                </Row>
                                보유 적립금 : {user.point}원 (사용 가능: {user.point - point.usePoint})
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div> {/*end of 쿠폰, 적립금 div*/}
                <div id="addressDiv">
                    <h3 className="text-left">배송지 정보</h3>
                    <hr/>
                    <Table id="addressTable" bordered>
                        <tbody>
                        <tr>
                            <th scope="row" width={"20%"}>배송지 선택</th>
                            <td>
                                <FormGroup tag="fieldset" row >
                                    <FormGroup check style={{marginLeft:"15px"}}>
                                        <Label check>
                                            <Input type="radio" name="addr"
                                                   onChange={()=>{setAddr(0); setDeliveryInfo(user); }}
                                                   checked={addr===0}
                                            />
                                            나의 배송지
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check style={{marginLeft:"15px"}}>
                                        <Label check>
                                            <Input type="radio" name="addr"
                                                   onChange={()=>{
                                                       setAddr(1);
                                                       setDeliveryInfo({...deliveryInfo ,recipient: "", ph: "",zonecode: "", address: "", detailAddress: ""});
                                                   }}
                                                   checked={addr===1}
                                            />
                                            새 배송지
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">수령인</th>
                            <td>
                                <Col sm={4}>
                                    <Input type="text" name="recipient" onChange={onTyping} value={deliveryInfo.recipient}/>
                                </Col>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">연락처</th>
                            <td className="text-left">
                                <Col sm={4}>
                                    <Input type="text" name="ph" onChange={onTyping} value={deliveryInfo.ph}/>
                                </Col>
                            </td>
                        </tr>
                        <tr>
                            { open ? <DaumPostcodeAPI handler={daumHandler}/> : null }
                            <th scope="row">
                                배송지 주소 <br/> <br/>
                                <Button onClick={(event) => {event.preventDefault(); setOpen(true);}}>주소찾기</Button>
                            </th>
                            <td>
                                <FormGroup>
                                    <Col lg={12} className="text-left mb-3">
                                        {(deliveryInfo.zonecode === "" ? <span className="text-muted">주소를 입력해주세요.</span> : deliveryInfo.zonecode +'   '+ deliveryInfo.address ) }

                                    </Col>
                                    <Row form>
                                        <Col sm={4}>
                                            <Input type="text" name="detailAddress" onChange={onTyping } value={deliveryInfo.detailAddress} placeholder="상세 주소 입력"/>
                                        </Col>
                                        {( addr === 1 ?
                                                <Col className="text-left">
                                                    <input type="checkbox" onChange={()=>{setSaveAddr(!saveAddr);}} checked={saveAddr}/> 기본 배송지로 저장
                                                </Col> :
                                                null
                                        )}
                                    </Row>
                                </FormGroup>
                            </td>{/*주소 FormGroup*/}
                        </tr>
                        </tbody>
                    </Table>
                </div> {/*end of 배송지 div*/}

                <div id="pay">
                    <h3 className="text-left">결제</h3>
                    <hr/>
                    <Table bordered>
                        <tbody>
                        <tr>
                            <th>상품 금액</th>
                            <th className="text-left">{totalPrice}원</th>
                        </tr>
                        <tr>
                            <td>
                                적립금 사용
                            </td>
                            <td className="text-left">
                                -{point.usePoint} 원
                            </td>
                        </tr>
                        <tr>
                            <td>배송비</td>
                            <td className="text-left">
                                +{delFee}원
                            </td>
                        </tr>
                        <tr>
                            <td>최종 결제 금액</td>
                            <td className="text-left font-weight-bold" style={{fontSize:"130%"}}>
                                {finalTotalPrice}원
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" width={"20%"}>결제 수단</th>
                            <td>
                                <FormGroup tag="fieldset" row >
                                    <FormGroup check style={{marginLeft:"15px"}}>
                                        <Label check>
                                            <Input type="radio" name="pay" value="카드" defaultChecked onChange={(e)=>{methodHandler(e)}}/>
                                            카드 결제
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check style={{marginLeft:"15px"}}>
                                        <Label check>
                                            <Input type="radio" name="pay" value="무통장입금" onChange={(e)=>{methodHandler(e)}}/>
                                            무통장 입금
                                        </Label>
                                    </FormGroup>
                                    <FormGroup check style={{marginLeft:"15px"}}>
                                        <Label check>
                                            <Input type="radio" name="pay" value="휴대폰" onChange={(e)=>{methodHandler(e)}}/>
                                            휴대폰 결제
                                        </Label>
                                    </FormGroup>
                                </FormGroup>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div> {/*end of 결제방법 div*/}
                <div id="agreement">
                    <h3 className="text-left">개인정보 약관 동의</h3>
                    <hr/>
                    <Terms/>
                    <input type="checkbox" onChange={agreement} defaultChecked={false} /> 약관에 동의합니다.
                </div> {/*end of 개인정보 동의 div*/}
            </div>
            <Button onClick={()=>{ buyingProducts();}}
                    disabled={agree}
                    color="primary" size="lg" style={{width:"40%", margin:"40px"}}
            >
                구매하기</Button>
        </div>
    );
}

export default Payment;