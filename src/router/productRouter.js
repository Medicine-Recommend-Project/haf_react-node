import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import UploadProduct from "../components/management/uploadProduct";
import ProductDetail from "../components/product/productDetail";

function Product({ match }) {

    return (
        <>
            <Switch>
                <Route path={`${match.path}/detail/:pcode`} component={ProductDetail} />
                <Route exact path={`${match.path}/upload`} component={UploadProduct} />
            </Switch>
        </>
    )
}

export default Product;