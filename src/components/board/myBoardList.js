import {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "reactstrap";
import {useHistory} from "react-router-dom";
import InquiryList from "./inquiryList";
import ReviewList from "./reviewList";

function MyBoardList() {
    let history = useHistory();

    const [reviewBoards, setReviewBoards] = useState({});
    const [inquiryBoards, setInquiryBoards] = useState({});

    useEffect(()=>{
        let url = '/api/board/getMyBoards';
        let data = { where : '%', pcode : '%' }
        axios.post(url, data)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                } else if(res.data.length > 0){
                    let boards = res.data;
                    let review = []; let inquiry = [];
                    for(let i = 0; i < boards.length; i++){
                        if(boards[i].category === '후기') review.push(boards[i]);
                        if(boards[i].category === '문의') inquiry.push(boards[i]);
                    }
                    setReviewBoards(review);
                    setInquiryBoards(inquiry);
                }
                else if(res.data.length === 0){ setReviewBoards({}); setInquiryBoards({}); }
            })
            .catch(err => console.log(err))
    },[]);


    return(
        <div style={{width:"80%", margin:"0 auto"}}>
            <div className="mx-auto my-5">
                <h1>나의 후기</h1>
                {reviewBoards.ocode}
                <ReviewList props={reviewBoards}/>
            </div>
            <div className="mx-auto my-5">
                <h1>나의 문의</h1>
                <InquiryList props={inquiryBoards}/>
            </div>
            </div>
    );
}

export default MyBoardList;
