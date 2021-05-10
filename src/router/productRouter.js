import { Route, Switch} from "react-router-dom"
import UploadProduct from "../components/management/uploadProduct";
import ProductDetail from "../components/product/productDetail";
import SearchProduct from "../components/product/searchProduct";

function Product({ match }) {

    return (
        <>
            <Switch>
                <Route path={`${match.path}/detail/:pcode`} component={ProductDetail} />
                <Route exact path={`${match.path}/upload`} component={UploadProduct} />
                <Route exact path={`${match.path}/search`} component={SearchProduct} />
            </Switch>
        </>
    )
}

export default Product;