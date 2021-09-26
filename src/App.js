/* eslint-disable */
import './App.css';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

/**********Route import**********/
import Customer from './router/CustomerRouter';
import Main from "./components/product/ProductMain";
import Board from "./router/BoardRouter";
import Order from "./router/OrderRouter";
import Product from "./router/ProductRouter";
import Management from "./components/management/Management";
import NavBar from "./components/home/NavBar";
import NavBar2 from "./components/home/NavBar2";
import Footer from "./components/home/Footer";
import React from "react";


function App(){
    return(
        <div className="App">
            <Router>
                <NavBar/>
                <NavBar2/>
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