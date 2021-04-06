import './App.css';
import React, {Component} from 'react';
import axios from "axios";

class App extends Component{

    /**
     * db정보가 레코드마다 배열의 원소로 저장되어 보내지므로 this.state.hello를 빈배열로 초기화합니다.
     * 그리고 받은 데이터는 개발모드 콘솔로 확인해봅니다.
     * */
    constructor(props) {
        super(props);
        this.state = {
            username:null
        };
    }

    /** 아래 함수 설명임. 필요없으면 지우셈 ~~~
     * componentDidMount()는 컴포넌트가 마운트된 직후, 즉 트리에 삽입된 직후에 호출됩니다.
     * DOM 노드가 있어야 하는 초기화 작업은 이 메서드에서 이루어지면 됩니다.
     * 외부에서 데이터를 불러와야 한다면, 네트워크 요청을 보내기 적절한 위치입니다.
     * 이 메서드는 데이터 구독을 설정하기 좋은 위치입니다.
     * 데이터 구독이 이루어졌다면, componentWillUnmount()에서 구독 해제 작업을 반드시 수행하기 바랍니다.
     * */
    componentDidMount(){
        /*
        fetch('api')
            .then(res => res.json())
            .then(data => this.setState({username: data.username}));
         */
        this._getHello();
    }

    _getHello = async() => {
        const res = await axios.get('/api/hello');
        console.log(res.data);
    }

    render(){
        const {username} = this.state;
        return (
        <div className="App">
          <header className="App-header">
{           username ? `Hello ${username}` : 'Hello World.'}
            <p>
                콘솔 보면 product table 값 들고온거 보임
            </p>
          </header>
        </div>
        );
    }
}

export default App;
