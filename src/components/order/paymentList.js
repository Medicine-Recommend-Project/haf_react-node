import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Row, Table} from "reactstrap";

function PaymentList({history}){
    let year = new Date().getFullYear(); // 년도
    let month = new Date().getMonth(); // 월 -1 되어있음
    let day = new Date().getDate();  // 날짜

    const [orderTitles, setOrderTitles] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [images, setImages] = useState([]);

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
                    let data = {
                        prevDate:  (''+year+'/'+month+'/'+day), //오늘로부터 한달 전
                        nowDate: (''+year+'/'+(month + 1)+'/'+(day+1)), //오늘 +1일...
                        ocode: "%"
                    }
                    axios.post(url, data)
                        .then(res =>{
                            setOrderTitles(res.data.orderTitle);
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


    let goReview = (ocode, pcode, pname)=>{
        history.push({
            pathname:"/board/review",
            product:{
                ocode: ocode,
                pcode: pcode,
                pname: pname
            }
        })
    }

    let productDetail = useCallback((pcode)=>{ history.push(`/product/detail/${pcode}`); } ,[]);

    const paymentDetails = orderTitles.length>0 && orderTitles.map((title, i)=> {
        //title의 주문코드와 동일한 detail만 골라서 반복문 돌리기 (이유: title과 detail은 1:N 관계)
        let details = orderDetails.length>0 && orderDetails.filter((detail)=> title.ocode === detail.ocode ).map((detail, j) => {
            let src;
            if(orderDetails.length > 1){
                src = images.length>0 && images.filter((img) => img.pcode === detail.pcode );  //지금 pcode와 동일한 image 정보만 들고오게끔
            }else{
                src = images.images
            }
            return(
                <tr key={i+"-"+j}>
                    <td style={{width:"10%"}}>{j}</td>
                    <td>
                        <Row onClick={()=>{productDetail(detail.pcode);}} style={{cursor:"pointer"}}>
                            <Col sm={3}>
                                {(
                                    images.length > 1 ?
                                        <img src={ `/${src[0].images}` } width={70} height={70} alt="상품 미리보기"/>
                                        :
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
                        <span style={{fontWeight:"bold", fontSize:"120%"}}>{detail.price}</span>원
                    </td>
                    <td style={{width:"15%"}}>
                        {(detail.addreview ?
                            <Button color="danger" disabled>후기 작성완료</Button>
                            :
                            <Button color="outline-danger" onClick={()=>{goReview(detail.ocode, detail.pcode, detail.pname);}}>후기 작성하기</Button>
                            )}
                        
                    </td>
                </tr>
            );
        });

        return (
            <div key={i} style={{marginBottom: "100px"}}>
                <Row className="font-weight-bolder">
                    <Col lg={3} className="text-left">
                        주문번호: {title.ocode}
                    </Col>
                    <Col className="text-right">
                        주문 일자: {title.odate}
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col className="text-right font-weight-bolder">
                        <span style={{fontSize:"170%", color:"#dc3545"}} >{title.totalPrice}</span>  원
                        ( <span style={{fontSize:"150%", color:"#dc3545"}}>{title.totalQuantity}</span>개 구매)
                    </Col>
                </Row>
                <Table bordered striped style={{margin: "30px 10px"}}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>상품</th>
                            <th>수량</th>
                            <th>금액</th>
                            <th>후기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details}
                    </tbody>
                </Table>
                <div style={{textAlign:"left"}}>
                    <p>
                        <span style={{fontSize:"20px"}}> ▼ 배송지 정보 </span>
                    </p>
                    <Table style={{width:"80%"}}>
                        <tbody>
                            <tr>
                                <th scope="row">주문자</th>
                                <td>{title.recipient}</td>
                            </tr>
                            <tr>
                                <th scope="row">연락처</th>
                                <td>{title.ph}</td>
                            </tr>
                            <tr>
                                <th scope="row">배송지</th>
                                <td>[{title.zonecode}] {title.address} {title.detailAddress}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    })

    return(
        <div style={{width:"90%", margin:"50px auto 0"}}>
            {paymentDetails}
        </div>
    );
}


export default PaymentList;