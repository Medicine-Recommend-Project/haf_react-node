import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {Button, Col, Row, Table} from "reactstrap";

function PaymentDetails({location}) {
    let history = useHistory();

    const [orderTitles, setOrderTitles] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [images, setImages] = useState([]);
    const delFee = (orderTitles.totalPrice >= 100000 ? 0 : 2500);

    useEffect(()=>{
        let url = '/customer/isLogin';
        axios.get(url)
            .then(res =>{
                if(res.data==="ppfalse"){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                    return;
                }else{
                    url = '/order/paymentDetails';
                    let ocode = location.ocode;
                    let data = { ocode: ocode }

                    axios.post(url, data)
                        .then(res => {
                            setOrderTitles(res.data.orderTitle[0]);
                            setOrderDetails(res.data.orderDetail);
                            setImages(res.data.images);
                        })
                        .catch(err => {
                            alert('결제내역 가져오기 에러발생');
                            console.log(err);
                        })
                }//end of if()
            })
            .catch(err => {
                alert('로그인 판단 에러발생');
                console.log(err);
            }); //end of outer axios
    },[]);


    const paymentDetails = orderDetails.length>0 && orderDetails.map((detail, j) => {
            let src;
            if(orderDetails.length > 1){
                src = images.length>0 && images.filter((img) => img.pcode === detail.pcode );  //지금 pcode와 동일한 image 정보만 들고오게끔
            }else{
                src = images.images
            }
            return(
                <tr key={"-"+j}>
                    <td style={{width:"10%"}}>{j}</td>
                    {/*<td>{detail.pcode}</td>*/}
                    <td>
                        <Row>
                            <Col sm={3}>
                                {(
                                    orderDetails.length > 1 ?
                                    <img src={ `/${src[0].images}` } width={70} height={70} alt="상품 미리보기"/> :
                                    <img src={ `/${src}` } width={70} height={70} alt="상품 미리보기"/>
                                )}

                            </Col>
                            <Col className="text-left">
                                {detail.pname}
                            </Col>
                        </Row>
                    </td>
                    <td>
                        {detail.quantity}
                    </td>
                    <td>
                        <span style={{fontWeight:"bold", fontSize:"120%"}}>{detail.price}</span>원</td>
                </tr>
            );  //return
        }); // details

        const titles = (
            <div style={{marginBottom: "100px"}}>
                <Row className="font-weight-bolder">
                    <Col lg={3} className="text-left">
                        주문번호: {orderTitles.ocode}
                    </Col>
                    <Col className="text-right">
                        주문 일자: {orderTitles.odate}
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col className="text-right font-weight-bolder">
                        <span style={{fontSize:"170%", color:"#dc3545"}} >{orderTitles.totalPrice}</span>  원
                        ( <span style={{fontSize:"150%", color:"#dc3545"}}>{orderTitles.totalQuantity}</span>개 구매)
                    </Col>
                </Row>
                <Table bordered striped style={{margin: "30px 10px"}}>
                    <thead>
                        <th>번호</th>
                        <th>상품</th>
                        <th>수량</th>
                        <th>금액</th>
                    </thead>
                    <tbody>
                        {paymentDetails}
                    </tbody>
                </Table>
                <div id="pointDiv">
                    <h3 className="text-left">쿠폰 및 적립금 사용</h3>
                    <hr/>
                    <Table id="pointTable" bordered>
                        <tbody>
                            <tr>
                                <th scope="row" width={"20%"}>쿠폰 적용</th>
                                <td className="text-left"> 없음  </td>
                            </tr>
                            <tr>
                                <th scope="row">적립금 사용</th>
                                <td  className="text-left">
                                    {orderTitles.usePoint}원
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
                            <th scope="row">수령인</th>
                            <td className="text-left">
                                {orderTitles.recipient}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">연락처</th>
                            <td className="text-left">
                                {orderTitles.ph}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                배송지 주소
                            </th>
                            <td className="text-left">
                                [{orderTitles.zonecode}] {orderTitles.address} {orderTitles.detailAddress}
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
                            <th scope="row">최종 결제 금액</th>
                            <td>
                                <Row className="text-left" >
                                    <Col>
                                    <span style={{fontSize:"150%", color:"cornflowerblue", fontWeight:"bold"}}>
                                        {orderTitles.totalPrice + delFee - orderTitles.usePoint}
                                    </span>원
                                    배송비(+{delFee}) 적립금 사용 (-{orderTitles.usePoint})
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row" width={"20%"}>결제 수단</th>
                            <td className="text-left">
                                {orderTitles.method}
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </div> {/*end of 결제방법 div*/}
            </div>
        );

    return(
        <div style={{width:"90%", margin:"50px auto 0"}}>
            <h1>구매가 완료되었습니다.</h1>
            <br/> <hr/> <br/>
            {titles}
            <div style={{marginBottom:"50px"}}>
                <Button onClick={()=>{history.push('/');}} size="lg">홈으로</Button>{'   '}
                <Button onClick={()=>{history.push('/order/paymentList');}} size="lg">구매 내역</Button>
            </div>
        </div>
    );
}

export default PaymentDetails;