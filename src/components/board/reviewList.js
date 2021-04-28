import {useEffect, useState} from "react";
import axios from "axios";

function ReviewList() {
    const [reviews, setReviews] = useState({});

    useEffect(()=>{
        let url = '/board/getBoards';
        let data = { where : '후기' }
        axios.post(url, data)
            .then(res => {
                setReviews(res.data);
                // console.log(res.data[0].pcode);
            })
            .catch(err => console.log(err))
    },[]);

    const reviewList = reviews.length > 0 && reviews.map((review, i) => (
        <tr key={i}>
            <td>{review.bcode}</td>
            <td>{review.category}</td>
            <td>{review.pcode}</td>
            <td>{review.rating}</td>
            <td>{review.title}</td>
            <td>{review.content}</td>
            <td>{review.cid}</td>
            <td>{review.bdate}</td>
        </tr>
    ))

    return(
        <div>
            <h1>후기 게시판이오</h1>
            <table style={{border: "1px solid black"}}>
                <thead>
                    <tr>
                        <td>게시글 번호</td>
                        <td>카테고리</td>
                        <td>상품 코드</td>
                        <td>평점</td>
                        <td>제목</td>
                        <td>내용</td>
                        <td>작성자</td>
                        <td>작성일자</td>
                    </tr>
                </thead>
                {reviewList}
            </table>
        </div>
    );
}

export default ReviewList;