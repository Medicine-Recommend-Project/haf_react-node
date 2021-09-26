import React from "react";
import {Route, Switch} from "react-router-dom"
import Inquiry from "../components/board/Inquiry";
import Review from "../components/board/Review";
import BoardList from "../components/board/BoardList";
import InquiryList from "../components/board/InquiryList";
import ReviewList from "../components/board/ReviewList";
import MyBoardList from "../components/board/MyBoardList";

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