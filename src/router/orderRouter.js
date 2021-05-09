import React from "react"
import {Link, Route, Switch} from "react-router-dom"

import Payment from "../components/order/payment";
import Basket from "../components/order/basket";
import PaymentDetails from "../components/order/paymentDetails";
import PaymentList from "../components/order/paymentList";


function Order({ match }) {

    return (
        <>
            <Switch>
                <Route exact path={`${match.path}/`} component={Basket} />
                <Route exact path={`${match.path}/payment`} component={Payment} />
                <Route exact path={`${match.path}/basket`} component={Basket} />
                <Route exact path={`${match.path}/paymentDetails`} component={PaymentDetails} />
                <Route exact path={`${match.path}/paymentList`} component={PaymentList} />
            </Switch>
        </>
    )
}

export default Order;