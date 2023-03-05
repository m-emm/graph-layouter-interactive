import logo from './logo.svg';
import './App.css';
import GraphSvg from './GraphSvg.js';

function App() {
  const listNodes = [{x:20,y:20},{x:50,y:70}]
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p></p>
        <GraphSvg nodes={listNodes}></GraphSvg>
      </header>
    </div>
  );
}

export default App;
