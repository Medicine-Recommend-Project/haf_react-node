import React from "react";
import {Route, Switch} from "react-router-dom"
/************Routes************/
import Join from "../components/customer/join";
import Login from "../components/customer/login";
import Mypage from "../components/customer/mypage";

function Customer({ match }) {

    return (
        <>
           <Switch>
                <Route path={`${match.path}/join`} component={Join} />
                <Route path={`${match.path}/mypage`} component={Mypage} />
                <Route exact path={`${match.path}/login`} component={Login} />
            </Switch>
        </>
    )
}

export default Customer