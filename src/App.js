import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import axios from "axios";
import {useContext, useEffect, useState} from "react";
/**********Route import**********/
import Customer from './router/customerRouter';
import Board from "./router/boardRouter";

function App(){
    //로그인 시 session관리 위해 정보 저장
    const [user, setUser] = useState({cid:"", grade:"", name:""});
    useEffect(async() => {
        axios.get('/')
            .then(res => {
                setUser({...user, cid: res.data.cid, grade: res.data.grade, name: res.data.name});
            })
            .catch(err => console.log(err))
    },[])

    return(
        <div className="App">
            <Router>
                {/*<header>부분은 프로젝트 완료 시 없앨 예정... 편의를 위함*/}
                <header>
                    <Link to="/">
                        <button>Home</button>
                    </Link>
                    <Link to="/customer">
                        <button>customer</button>
                    </Link>
                    <Link to="/board">
                        <button>board</button>
                    </Link>
                </header>
                <hr />
                지금 로그인 정보 >> ID : {user.cid} , GRADE : {user.grade}, NAME : {user.name}
                <Switch>
                    <Route path="/customer" component={Customer} />
                    <Route path="/board" component={Board} />

                </Switch>
            </Router>
        </div>
    );
}

export default App;