import React, {useEffect, useState} from "react";
import axios from "axios";

function PaymentDetails() {

    const [paymentDetails, setPaymentDetails] = useState({});

    useEffect(()=>{
        let url = '/order/paymentDetail';
        axios.get(url)
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