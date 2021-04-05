import './App.css';
import {Component} from 'react';

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username:null
        };
    }
    // const [username, setUsername] = useState({username: null});

    componentDidMount(){
        fetch('api')
            .then(res => res.json())
            .then(data => this.setState({username: data.username}));
    }
    render(){
        const {username} = this.state;
        return (
        <div className="App">
          <header className="App-header">
              {username ? `Hello ${username}` : 'Hello World.'}
          </header>
        </div>
        );
    }
}

export default App;
