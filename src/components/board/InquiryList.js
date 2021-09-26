import React from "react";
import {Table} from "reactstrap";
import {changeDateFormatting} from "../../front_common/page_common";

function InquiryList({props}) {
    const inquiryBoards = props;

    const inquiryBoard =  inquiryBoards.length > 0 && inquiryBoards.map((board,i)=>(
        <tr key={i}>
            <td>{board.detailCategory}</td>
            <td>{board.title}</td>
            <td style={{width:"250px",wordBreak:"break-all"}}>{board.content}</td>
            <td>{board.cid}</td>
            <td>{changeDateFormatting(board.bdate, 5)}</td>
        </tr>
    ));

    return (
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
            {inquiryBoard ? inquiryBoard :  <tr><td colSpan={5}>문의글이 존재하지 않습니다.</td></tr>}
            </tbody>
        </Table>
    );
}

export default InquiryList;