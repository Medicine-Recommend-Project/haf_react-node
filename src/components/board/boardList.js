import {useEffect, useState} from "react";
import axios from "axios";

function BoardList() {
    const [allBoards, setAllBoards] = useState({});

    useEffect(()=>{
        let url = '/board/getBoards';
        let data = { where : '%' }
        axios.post(url, data)
            .then(res => {
                setAllBoards(res.data);
                // console.log(res.data[0].pcode);
            })
            .catch(err => console.log(err))
    },[]);

    const boards = allBoards.length > 0 && allBoards.map((board, i) => (
        <tr key={i}>
            <td>{board.bcode}</td>
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
            <table style={{border: "1px solid black"}}>
                <thead>
                    <tr>
                        <td>게시글 번호</td>
                        <td>카테고리</td>
                        <td>문의 종류</td>
                        <td>상품 코드</td>
                        <td>평점</td>
                        <td>제목</td>
                        <td>내용</td>
                        <td>작성자</td>
                        <td>작성일자</td>
                    </tr>
                </thead>
                {boards}
            </table>
        </div>
    );
}

export default BoardList;