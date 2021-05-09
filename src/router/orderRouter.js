import React from "react"
import {Link, Route, Switch} from "react-router-dom"

import Payment from "../components/order/payment";
import Basket from "../components/order/basket";
import PaymentDetails from "../components/order/paymentDetails";


function Order({ match }) {

    return (
        <>
            <header>
                <Link to={`${match.path}/basket`}>
                    <button>장바구니</button>
                </Link>
                <Link to={`${match.path}/paymentDetails`}>
                    <button>결제내역</button>
                </Link>
            </header>
            <Switch>
                <Route exact path={`${match.path}/`} component={Basket} />
                <Route exact path={`${match.path}/payment`} component={Payment} />
                <Route exact path={`${match.path}/basket`} component={Basket} />
                <Route exact path={`${match.path}/paymentDetails`} component={PaymentDetails} />
            </Switch>
        </>
    )
}

export default Order;