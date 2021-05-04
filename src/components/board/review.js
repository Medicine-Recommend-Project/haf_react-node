import {useCallback, useEffect, useState} from "react";
import axios from "axios";

function Review({history}) {

    const [user, setUser] = useState({cid:"", cname:""});
    const [review, setReview] = useState({
        pCode: "", category : "후기", rating: 5, title: "", content: ""
    })
    const [products, setProducts] = useState({});
    const [stars, setStars] = useState(['★','★','★','★','★']);

    useCallback(useEffect(()=>{
        let url = '/product/getPcode' ;
        axios.get(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    return history.push('/customer/login');
                }
                setProducts([res.data.row]);
                setUser({...user, cid: res.data.cid, cname: res.data.cname})
                setReview({...review, pCode: res.data.row[0].pcode}); // select 안바꾸면 기본 선택값은 첫번째 pcode...
            })
            .catch(err => console.log(err))
    },[]))

    let onTyping = (e)=> {
        setReview({...review, [e.target.name]: e.target.value});
    }

    // products state가 초기화되기 전에 map을 쓰려고하니까 에러나서 &&으로 조건주기
    const productsList = products[0] && products[0].map(product => (
        <option key={product.pcode} value={product.pcode} >
            {product.pname}
        </option>
    ));

    //평점 별 누르면 점수 및 별 색깔 바뀌게 함
    let starHandler = (i)=>{
        let changeStar = [...stars];
        setReview({...review, rating: i+1});
        for(let s = 0; s < stars.length; s++){
            if(s > i){ changeStar[s] = '☆' }
            else { changeStar[s] = '★' }
        }
        setStars(changeStar);
    }
    // 별 5개 뿌리기
    const rate = stars.map((rate, i) =>(
        <span key={i} onClick={e=>{ e.preventDefault(); starHandler(i); }} style={{cursor: "pointer"}}>{rate}</span>
    ));

    let submitForm = (e)=>{
        e.preventDefault();

        for(let i in Object.keys(review)){
            if(review[Object.keys(review)[i]] === "" || review[Object.keys(review)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()

        let url = '/board/review' ;
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(review)){
            data[Object.keys(review)[i]] = review[Object.keys(review)[i]];
        }//end of for
        data["cid"] = user.cid;
        data["cname"] = user.cname;

        // console.log('data : ',data);
        axios.post(url, data)
            .then(res => {
                if(res.data > 0){
                    alert('글이 정상적으로 등록되었습니다.');
                    history.push('/');
                }else{
                    alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
                }
            })
            .catch(e => {
                console.log(e);
                alert('글 등록에 실패하였습니다. 다시 시도해주세요.');
            });//end of axios.post();
    }// end of submitForm();

    return(
        <div>
            <h1>후기 게시판</h1>
            <form onSubmit={submitForm}>

                상품
                <select name="pCode" value={review.pCode} onChange={onTyping}>
                    {productsList}
                </select>
                <br/>
                제목 <input type="text" name="title"  value={review.title} onChange={onTyping} placeholder="제목을 입력해주세요." /> <br/>
                작성자 {user.cname}님 ({user.cid}) <br/>
                평점 {rate} {review.rating}점 <br/>
                내용 <br/>
                <textarea name="content" value={review.content} onChange={onTyping} id="content" cols="30" rows="10"> </textarea> <br/>
                <button type="submit">작성하기</button>
            </form>
        </div>
    );
}

export default Review;