import React from "react"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import Inquiry from "../components/board/inquiry";
import Review from "../components/board/review";
import BoardList from "../components/board/boardList";
import InquiryList from "../components/board/inquiryList";
import ReviewList from "../components/board/reviewList";

function Board({ match }) {

    return (
        <>
            <header>
                <Link to={`${match.path}/review`}>
                    <button>후기작성</button>
                </Link>
                <Link to={`${match.path}/inquiry`}>
                    <button>문의작성</button>
                </Link>
                <Link to={`${match.path}/reviewList`}>
                    <button>후기글 보기</button>
                </Link>
                <Link to={`${match.path}/inquiryList`}>
                    <button>문의글 보기</button>
                </Link>
            </header>
            <Switch>
                <Route exact path={`${match.path}/`} component={BoardList} />
                <Route exact path={`${match.path}/review`} component={Review} />
                <Route exact path={`${match.path}/inquiry`} component={Inquiry} />
                <Route exact path={`${match.path}/reviewList`} component={ReviewList} />
                <Route exact path={`${match.path}/inquiryList`} component={InquiryList} />
            {/*    https://sustainable-dev.tistory.com/117  */}
            </Switch>
        </>
    )
}

export default Board;