/* eslint-disable */
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

/**********Route import**********/
import Customer from './router/customerRouter';
import Main from "./components/product/productMain";
import Board from "./router/boardRouter";
import Order from "./router/orderRouter";
import Product from "./router/productRouter";
import Management from "./components/management/management";
import NavBar from "./components/home/navBar";
import NavBar2 from "./components/home/navBar2";
import Footer from "./components/home/footer";


function App(){
    return(
        <div className="App">
            <NavBar/>
            <NavBar2/>
            <Router>
                <Switch>
                    <Route exact path="/" component={Main}/>
                    <Route path="/product" component={Product}/>
                    <Route path="/customer" component={Customer} />
                    <Route path="/board" component={Board} />
                    <Route path="/order" component={Order} />
                    <Route path="/management" component={Management} />
                    <Route render={() => <div><h1>존재하지 않는 페이지입니다</h1></div>} />
                </Switch>
            </Router>
            <Footer/>
        </div>
    );
}

export default App;