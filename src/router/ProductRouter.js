import React from "react";
import { Route, Switch} from "react-router-dom"
import UploadProduct from "../components/management/UploadProduct";
import ProductDetail from "../components/product/ProductDetail";
import SearchProduct from "../components/product/SearchProduct";
import Main from "../components/product/ProductMain";

function Product({ match }) {

    return (
        <>
            <Switch>
                <Route exact path={`${match.path}`} component={Main}/>
                <Route path={`${match.path}/detail/:pcode`} component={ProductDetail} />
                <Route exact path={`${match.path}/upload`} component={UploadProduct} />
                <Route exact path={`${match.path}/search`} component={SearchProduct} />
            </Switch>
        </>
    )
}

export default Product;