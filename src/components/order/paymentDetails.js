import React, {useEffect, useState} from "react";
import axios from "axios";

function PaymentDetails() {
    let date = new Date();
    let year = date.getFullYear(); // 년도
    let month = date.getMonth() + 1;  // 월
    let day = date.getDate();  // 날짜

    console.log(year+'/'+month+'/'+day);

    const [paymentDetails, setPaymentDetails] = useState({});

    useEffect(()=>{
        let url = '/order/paymentDetail';
        let data = {
            prevDate: year+'/'+date.getMonth()+'/'+day,
            nowDate: year+'/'+month+'/'+day,
        }
        axios.post(url, data)
            .then(res =>{
                setPaymentDetails(res.data);
            })
            .catch()
    },[]);

    const details = paymentDetails.length>0 && paymentDetails.map((detail, i) => (
            <tr key={i}>
                <td>{i}</td>
                <td>
                    {detail.pcode}번 상품
                    <img src="http://placehold.it/50x50" alt="상품 미리보기"/>
                    {detail.pname}
                </td>
                <td>
                    {detail.quantity}
                </td>
                <td>{detail.price}</td>
                <td>{detail.odate}</td>
            </tr>
    ))
    return(
        <div>
            <h1>결제 내역 페이지</h1>
            <table>
                <thead>
                    <tr>
                        <th> </th>
                        <th>상품</th>
                        <th>수량</th>
                        <th>금액</th>
                        <th>주문 일자</th>
                    </tr>
                </thead>
                <tbody>
                    {details}
                </tbody>
            </table>
        </div>
    );
}

export default PaymentDetails;