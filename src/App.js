import logo from './logo.svg';
import './App.css';
import GraphSvg from './GraphSvg.js';

import {multiBodyForce} from './MultiBodyForce.js'
import {borderForce} from './BorderForce.js';


function App() {
  const width = 2000;
  const height = 800;
  let nodeRadius = 60
  const centerForceStrength = 0.2
  const listNodes = [{ x: 20, y: 20 }, { x: 50, y: 70 }, { x: 80, y: 20 } , { x: 20, y: 70 }, { x: 80, y: 70 }, { x: 700, y: 800 },{ x: 20, y: 70 }, { x: 80, y: 70 }, { x: 700, y: 800 }]
  const forces = [
     (nodes) => { return nodes.map((node) => ({ vx: -(node.x - width/2 ) * centerForceStrength/100, vy: -(node.y - height/2) * centerForceStrength/100 })) },
     multiBodyForce(0.1)
    , borderForce(width,height, nodeRadius,0.1)
  ]
  



  return (
    <div className="App">
      <header className="App-header">

        <p></p>
        <GraphSvg width={width}  height={height} nodes={listNodes} velocityDecay="0.6" forces={forces} nodeRadius={nodeRadius}></GraphSvg>
      </header>
    </div>
  );
}

export default App;
