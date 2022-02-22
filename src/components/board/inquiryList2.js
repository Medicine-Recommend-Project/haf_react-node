import {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "reactstrap";
import {changeDateFormatting} from "../../front_common/page_common";

function InquiryList2() {
    const [inquiries, setInquiries] = useState({});

    useEffect(()=>{
        let url = '/api/board/getBoards';
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
            <th scope="row">{inquiry.bcode}</th>
            <td>{inquiry.category}</td>
            <td>{inquiry.detailCategory}</td>
            <td>{inquiry.pcode}</td>
            <td>{inquiry.title}</td>
            <td>{inquiry.content}</td>
            <td>{inquiry.cid}</td>
            <td>{changeDateFormatting(inquiry.bdate)}</td>
        </tr>
    ))

    return(
        <div>
            <h1>문의 게시판이오</h1>
            <Table hover size="sm">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>카테고리</th>
                        <th>문의 종류</th>
                        <th>상품 코드</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {inquiryList}
                </tbody>
            </Table>
        </div>
    );
}

export default InquiryList2;