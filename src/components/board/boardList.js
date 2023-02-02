import {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "reactstrap";

function BoardList({history}) {
    const [allBoards, setAllBoards] = useState({});
    // const [reviewBoards, setReviewBoards] = useState({});
    // const [inquiryBoards, setInquiryBoards] = useState({});

    useEffect(()=>{
        let url = '/api/board/getBoards';
        let data = { where : '%' , pcode : '%' }
        axios.post(url, data)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                // else if(res.data.length > 0){
                //     let boards = res.data;
                //     let review = []; let inquiry = [];
                //     for(let i = 0; i < boards.length; i++){
                //         if(boards[i].category === '후기') review.push(boards[i]);
                //         if(boards[i].category === '문의') inquiry.push(boards[i]);
                //     }
                //     setReviewBoards(review);
                //     setInquiryBoards(inquiry);
                // }
                // else if(res.data.length === 0){ setReviewBoards({}); setInquiryBoards({}); }
                setAllBoards(res.data);
            })
            .catch(err => console.log(err))
    },[]);

    const boards = allBoards.length > 0 && allBoards.map((board, i) => (
        <tr key={i}>
            <th scope="row">{board.bcode}</th>
            <td>{board.category}</td>
            <td>{board.detailCategory}</td>
            <td>{board.pcode}</td>
            <td>{board.rating}</td>
            <td>{board.title}</td>
            <td>{board.content}</td>
            <td>{board.cid}</td>
            <td>{board.bdate}</td>
        </tr>
    ))

    return(
        <div>
            <h1>게시판이오</h1>
            <Table bordered hover striped>
                <thead>
                    <tr>
                        <th>게시글 번호</th>
                        <th>카테고리</th>
                        <th>문의 종류</th>
                        <th>상품 코드</th>
                        <th>평점</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {boards}
                </tbody>
            </Table>
        </div>
    );
}

export default BoardList;