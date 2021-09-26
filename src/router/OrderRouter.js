import React from "react";
import {Route, Switch} from "react-router-dom";

import Payment from "../components/order/Payment";
import Basket from "../components/order/Basket";
import PaymentDetails from "../components/order/PaymentDetails";
import PaymentList from "../components/order/PaymentList";


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