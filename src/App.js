import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'

/**********Route import**********/
import Customer from './router/customerRouter';

function App(){

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
                    <Switch>
                        <Route path="/customer" component={Customer} />

                    </Switch>
            </Router>
        </div>
    );
}

export default App;