import {useEffect, useState} from "react";
import axios from "axios";

function InquiryList() {
    const [inquiries, setInquiries] = useState({});

    useEffect(()=>{
        let url = '/board/getBoards';
        let data = { where : '문의' , pcode : '%' }
        axios.post(url, data)
            .then(res => {
                setInquiries(res.data);
                // console.log(res.data[0].pcode);
            })
            .catch(err => console.log(err))
    },[]);

    const inquiryList = inquiries.length > 0 && inquiries.map((inquiry, i) => (
        <tr key={i}>
            <td>{inquiry.bcode}</td>
            <td>{inquiry.category}</td>
            <td>{inquiry.detailCategory}</td>
            <td>{inquiry.pcode}</td>
            <td>{inquiry.title}</td>
            <td>{inquiry.content}</td>
            <td>{inquiry.cid}</td>
            <td>{inquiry.bdate}</td>
        </tr>
    ))

    return(
        <div>
            <h1>문의 게시판이오</h1>
            <table style={{border: "1px solid black"}}>
                <thead>
                    <tr>
                        <td>게시글 번호</td>
                        <td>카테고리</td>
                        <td>문의 종류</td>
                        <td>상품 코드</td>
                        <td>제목</td>
                        <td>내용</td>
                        <td>작성자</td>
                        <td>작성일자</td>
                    </tr>
                </thead>
                <tbody>
                    {inquiryList}
                </tbody>
            </table>
        </div>
    );
}

export default InquiryList;