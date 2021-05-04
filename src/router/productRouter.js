import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom"
import UploadProduct from "../components/management/uploadProduct";
import ProductDetail from "../components/product/productDetail";

function Product({ match }) {

    return (
        <>
            <header>
                <Link to={`${match.path}/upload`}>
                    <button>상품업로드</button>
                </Link>
            </header>
            <Switch>
                <Route exact path={`${match.path}/upload`} component={UploadProduct} />
                <Route path={`${match.path}/detail/:pcode`} component={ProductDetail} />
            </Switch>
        </>
    )
}

export default Product;