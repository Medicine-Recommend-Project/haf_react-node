/* eslint-disable */
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

/**********Route import**********/
import Customer from './router/customerRouter';
import Main from "./components/product/productMain";
import Board from "./router/boardRouter";
import Order from "./router/orderRouter";
import Product from "./router/productRouter";
import Management from "./components/management/management";
import NavBar from "./components/home/navBar";

function App(){
    //로그인 시 session관리 위해 정보 저장
    // const [user, setUser] = useState({cid:"", grade:"", cname:""});
    // useEffect(async() => {
    //     axios.get('/')
    //         .then(res => {
    //             setUser({...user, cid: res.data.cid, grade: res.data.grade, cname: res.data.cname});
    //         })
    //         .catch(err => console.log(err))
    // },[])

    return(
        <div className="App">
            <Router>
                <NavBar/>
                {/*지금 로그인 정보 >> ID : {user.cid} , GRADE : {user.grade}, NAME : {user.cname}*/}
                <Switch>
                    <Route exact path="/" component={Main}/>
                    {/*<Route exact path="localhost:3000" component={Main}/>*/}
                    <Route path="/product" component={Product}/>
                    <Route path="/customer" component={Customer} />
                    <Route path="/board" component={Board} />
                    <Route path="/order" component={Order} />
                    <Route path="/management" component={Management} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;