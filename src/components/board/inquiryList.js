import React from "react";
import {Table} from "reactstrap";

function InquiryList({props}) {
    const inquiryBoards = props;

    const inquiryBoard =  inquiryBoards.length > 0 && inquiryBoards.map((board,i)=>(
        <tr key={i}>
            <td>{board.detailCategory}</td>
            <td>{board.title}</td>
            <td style={{width:"250px",wordBreak:"break-all"}}>{board.content}</td>
            <td>{board.cid}</td>
            <td>{board.bdate}</td>
        </tr>
    ));

    const Inquiry = (
        <Table striped bordered size="sm">
            <thead>
            <tr>
                <th>분류</th>
                <th>제목</th>
                <th>내용</th>
                <th>작성자</th>
                <th>작성일</th>
            </tr>
            </thead>
            <tbody>
            {inquiryBoard.length > 0 ? inquiryBoard :  <tr><td colSpan={6}>문의글이 존재하지 않습니다.</td></tr>}
            </tbody>
        </Table>
    );

    return Inquiry;
}

export default InquiryList;