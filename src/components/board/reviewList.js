import React from "react";
import {Table} from "reactstrap";
import {changeDateFormatting} from "../../front_common/page_common";

function ReviewList({props}) {

    if(props.length > 0){

        const reviewBoards = props;

        let changeStars = (rating) =>{
            let feeling = ['  별로에요','  나쁘지않아요','  괜찮아요','  좋아요','  최고에요'];
            let star = '⭐';
            let ratingStar = '';
            for(let i=1; i<=rating; i++){ ratingStar += star; }
            ratingStar += feeling[rating-1];

            return ratingStar;
        }

        return reviewBoards.length > 0 && reviewBoards.map((board, i)=>(
            <Table key={i} striped>
                <tbody>
                <tr>
                    <td colSpan="2" className="text-left"><strong>{board.title}</strong></td>
                    <td className="text-left" >{changeStars(board.rating)}</td>
                    <td className="text-right" >작성자: {board.cid} 작성일: {changeDateFormatting(board.bdate, 5)}</td>
                </tr>
                <tr>
                    <td colSpan="3" className="text-left">{board.content}</td>
                    <td className="text-right"><img src="http://placehold.it/70x70" alt=""/> </td>
                </tr>
                </tbody>
            </Table>
        ));
    }else{
        return <strong>아직 후기가 없어요. 후기를 남겨주세요</strong> ;
    }
}

export default ReviewList;
