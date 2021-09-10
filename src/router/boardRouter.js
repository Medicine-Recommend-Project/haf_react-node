import React from "react";
import {Route, Switch} from "react-router-dom"
import Inquiry from "../components/board/inquiry";
import Review from "../components/board/review";
import BoardList from "../components/board/boardList";
import InquiryList from "../components/board/inquiryList";
import ReviewList from "../components/board/reviewList";
import MyBoardList from "../components/board/myBoardList";

function Board({ match }) {

    return (
        <>
            <Switch>
                <Route exact path={`${match.path}/`} component={BoardList} />
                <Route exact path={`${match.path}/review`} component={Review} />
                <Route exact path={`${match.path}/inquiry`} component={Inquiry} />
                <Route exact path={`${match.path}/reviewList`} component={ReviewList} />
                <Route exact path={`${match.path}/inquiryList`} component={InquiryList} />
                <Route exact path={`${match.path}/myBoardList`} component={MyBoardList} />
            </Switch>
        </>
    )
}

export default Board;