import React from "react"
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import Join from "../components/customer/join";
import Login from "../components/customer/login";
import Logout from "../components/customer/logout";
import Mypage from "../components/customer/mypage";

function Customer({ match }) {
    return (
        <Router>
            <header>
                <Link to={`${match.path}/join`}>
                    <button>Join</button>
                </Link>
                <Link to={`${match.path}/mypage`}>
                    <button>MyPage</button>
                </Link>
                <Link to={`${match.path}/login`}>
                    <button>Login</button>
                </Link>
                <Link to={`${match.path}/logout`}>
                    <button>Logout</button>
                </Link>
            </header>
            <Switch>
                <Route path={`${match.path}/join`} component={Join} />
                <Route path={`${match.path}/mypage`} component={Mypage} />
                <Route exact path={`${match.path}/login`} component={Login} />
                <Route exact path={`${match.path}/logout`} component={Logout} />
            </Switch>
        </Router>
    )
}

export default Customer