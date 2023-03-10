import './App.css';
import GraphContainer from './GraphContainer.js';


function App() {
  const width = 2000;
  const height = 900;
  const nodeRadius = 40;
 
  return (
    <div className="App">
      <header className="App-header">              
        <GraphContainer width={width} height={height} nodeRadius={nodeRadius}/>
      </header>
    </div>
  );
}

export default App;
