import logo from './logo.svg';
import './App.css';
import GraphSvg from './GraphSvg.js';

import {multiBodyForce} from './MultiBodyForce.js'
import {borderForce} from './BorderForce.js';


function App() {
  const width = 2000;
  const height = 1000;
  let nodeRadius = 60
  const centerForceStrength = 0.8
  let listNodes = []
  for(let i=0;i<5;i++) {
    for(let j=0;j<5;j++) {
      listNodes.push({x: i*nodeRadius*2, y: j*nodeRadius*2, name: "Node "+i+" "+j})
    }     
  }

  const listEdges = [{source:1,target:2}]
  
  
  const forces = [
     (nodes) => { return nodes.map((node) => ({ vx: -(node.x - width/2 ) * centerForceStrength/100, vy: -(node.y - height/2) * centerForceStrength/100 })) },
     multiBodyForce(0.5)
    , borderForce(width,height, nodeRadius,0.4)
  ]
  



  return (
    <div className="App">
      <header className="App-header">

        <p></p>
        <GraphSvg width={width}  height={height} nodes={listNodes} edges = {listEdges} velocityDecay="0.6" forces={forces} nodeRadius={nodeRadius}></GraphSvg>
      </header>
    </div>
  );
}

export default App;
