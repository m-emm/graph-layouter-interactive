import logo from './logo.svg';
import './App.css';
import GraphSvg from './GraphSvg.js';

import { multiBodyForce } from './MultiBodyForce.js'
import { borderForce } from './BorderForce.js';
import { linkForce } from './LinkForce';
import architecture from './architecture'; 
import { collisionForce } from './CollisionForce';


function App() {
  const width = 2000;
  const height = 1400;
  const nodeRadius = 40;
  const centerForceStrength = 1.0
  const numCols = 5;

  let listNodes =  architecture().nodes
  listNodes = listNodes.map((node,i) => ({ ...node, x: node.x !== undefined ? node.x : width/2  + nodeRadius * 2*(i % numCols), y: node.y !== undefined ? node.y : height*0.05 + 5*nodeRadius*( Math.floor(i / numCols))}));
  const listEdges = architecture().links
  
  function distance_function(link,nodes) {
    const source = nodes[link.source];
    const target = nodes[link.target];

    if (target.type == "interface") {
      return nodeRadius *2;
    } else {
      return nodeRadius * 5;
    }
  }

  function radius_function(node) {
    if (node.type == "interface") {
      return nodeRadius * 4;
    } else if (node.type == "computation-node")  { 
      return nodeRadius * 4;
    } else {
      return nodeRadius*4;
    }
  }

  const forces = [
    (nodes) => { return nodes.map((node) => ({ vx: -(node.x - width / 2) * centerForceStrength / 100, vy: -(node.y - height / 2) * centerForceStrength / 100 })) },
    multiBodyForce(0.3)
    , borderForce(width, height, nodeRadius*3, 0.4),
    , linkForce(0.04,distance_function,listEdges )
    , collisionForce(0.1, radius_function)
  ]




  return (
    <div className="App">
      <header className="App-header">

        <p></p>
        <GraphSvg width={width} height={height} nodes={listNodes} edges={listEdges} velocityDecay="0.6" forces={forces} nodeRadius={nodeRadius}></GraphSvg>
      </header>
    </div>
  );
}

export default App;
