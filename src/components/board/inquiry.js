import {useEffect, useState} from "react";
import axios from "axios";
import {useHistory} from "react-router-dom";

function Inquiry({props}) {
    let history = useHistory();

    const [user, setUser] = useState({cid:"", name:""});
    const [inquiry, setInquiry] = useState({
        pCode: "", category : "문의", DetailCategory: "상품문의",title: "", content: ""
    })
    const [products, setProducts] = useState({});


    useEffect(()=>{
        let url = '/product/getPcode' ;
        axios.get(url)
            .then(res => {
                if(res.data === 'ppfalse'){
                    alert('로그인이 필요한 서비스입니다.');
                    history.push('/customer/login');
                }
                setProducts([res.data.row]);
                setUser({...user, cid: res.data.cid, name: res.data.name})
                setInquiry({...inquiry, pCode: res.data.row[0].pcode}); // select 안바꾸면 기본 선택값은 첫번째 pcode...
            })
            .catch(err => console.log(err))
    },[])

    let onTyping = (e)=> {
        setInquiry({...inquiry, [e.target.name]: e.target.value});
    }

    // products state가 초기화되기 전에 map을 쓰려고하니까 에러나서 &&으로 조건주기
    const productsList = products[0] && products[0].map(product => (
        <option key={product.pcode} value={product.pcode} >
            {product.pname}
        </option>
    ));

    let submitForm = (e)=>{
        e.preventDefault();

        for(let i in Object.keys(inquiry)){
            if(inquiry[Object.keys(inquiry)[i]] === "" || inquiry[Object.keys(inquiry)[i]].length === 0){
                alert('빈칸을 채워주세요!');
                return;
            }//end of if()
        }//end of for()

        let url = '/board/inquiry' ;
        let data = {};

        //data 객체에 inputs state에 있는 값들을 for 문을 통해 간편히 추가
        for(let i in Object.keys(inquiry)){
            data[Object.keys(inquiry)[i]] = inquiry[Object.keys(inquiry)[i]];
        }//end of for
        data["cid"] = user.cid;
        data["name"] = user.name;

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
            <h1>문의 게시판</h1>
            <form onSubmit={submitForm}>
                <select name="DetailCategory" value={inquiry.DetailCategory} onChange={onTyping}>
                    <option value="상품문의">상품문의</option>
                    <option value="교환및반품">교환및반품</option>
                    <option value="결제문의">결제문의</option>
                    <option value="기타">기타</option>
                </select> <br/>
                상품
                <select name="pCode" value={inquiry.pCode} onChange={onTyping}>
                    {productsList}
                </select>
                <br/>
                제목 <input type="text" name="title"  value={inquiry.title} onChange={onTyping} placeholder="제목을 입력해주세요." /> <br/>
                작성자 {user.name}님 ({user.cid}) <br/>
                내용 <br/>
                <textarea name="content" value={inquiry.content} onChange={onTyping} id="content" cols="30" rows="10"> </textarea> <br/>
                <button type="submit">작성하기</button>
            </form>
        </div>
    );
}

export default Inquiry;