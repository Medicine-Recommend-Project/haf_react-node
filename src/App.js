import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
/**********Route import**********/
import Customer from './router/customerRouter';
import {useEffect, useState} from "react";
import axios from "axios";

function App(){
    //로그인 시 session관리 위해 정보 저장
    const [user, setUser] = useState({cid:"", grade:""});
    useEffect(async() => {
        axios.get('/user')
            .then(res => {
                setUser({...user, cid: res.data.cid, grade: res.data.grade});
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
                </header>
                <hr />
                지금 로그인 정보 >> ID : {user.cid} , GRADE : {user.grade}
                <Switch>
                    <Route path="/customer" component={Customer} />

                </Switch>
            </Router>
        </div>
    );
}

export default App;