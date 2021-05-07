import {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "reactstrap";

function ReviewList({history}) {

    const [reviews, setReviews] = useState({});

    useEffect(()=>{
        let url = '/board/getBoards';
        let data = { where : '후기', pcode : '%' }
        axios.post(url, data)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                setReviews(res.data);
                // console.log(res.data[0].pcode);
            })
            .catch(err => console.log(err))
    },[]);

    const reviewList = reviews.length > 0 && reviews.map((review, i) => (
        <tr key={i}>
            <th scope="row">{review.bcode}</th>
            <td>{review.category}</td>
            <td>{review.pcode}</td>
            <td>{review.rating}</td>
            <td>{review.title}</td>
            <td colSpan={2}>{review.content}</td>
            <td>{review.cid}</td>
            <td>{review.bdate}</td>
        </tr>
    ))

    return(
        <div>
            <h1>후기 게시판이오</h1>
            <Table hover size="sm">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>카테고리</th>
                        <th>상품 코드</th>
                        <th>평점</th>
                        <th>제목</th>
                        <th colSpan={2}>내용</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewList}
                </tbody>
            </Table>
        </div>
    );
}

export default ReviewList;
