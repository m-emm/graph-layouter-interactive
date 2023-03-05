import logo from './logo.svg';
import './App.css';
import GraphSvg from './GraphSvg.js';
import { quadtree } from "d3-quadtree";


const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32

function lcg() {
  let s = 1;
  return () => (s = (a * s + c) % m) / m;
}
const random = lcg;

function jiggle(random) {
  return (random() - 0.5) * 1e-6;
}


const theta2 = 0.81;
const distanceMin2 = 1;
const distanceMax2 = Infinity;
const alpha = 1;
const global_strength = -10;

function accumulate(strengths) {
  return function (quad) {
    var strength = 0, q, c, weight = 0, x, y, i;

    // For internal nodes, accumulate forces from child quadrants.
    if (quad.length) {
      let x = 0;
      let y = 0;
      for (let i = 0; i < 4; ++i) {
        const q = quad[i];
        if (q) {
          const c = Math.abs(q.value);
          if (c) {
            strength += q.value;
            weight += c;
            x += c * q.x;
            y += c * q.y;
          }
        }
      }
      quad.x = x / weight;
      quad.y = y / weight;
    }

    // For leaf nodes, accumulate forces from coincident quadrants.
    else {
      q = quad;
      q.x = q.data.x;
      q.y = q.data.y;
      do strength += strengths[q.data.index];
      while (q = q.next);
    }

    quad.value = strength;
  }
}

function apply(node, strengths) {

  return function (quad, x1, _, x2) {
    if (!quad.value) return true;

    let x = quad.x - node.x;
    let y = quad.y - node.y;
    let  w = x2 - x1;
    let  l = x * x + y * y;

    // Apply the Barnes-Hut approximation if possible.
    // Limit forces for very close nodes; randomize direction if coincident.
    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x === 0) {
          x = jiggle(random);
          l += x * x;
        }
        if (y === 0) {
          y = jiggle(random);
          l += y * y;
        }
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x * quad.value * alpha / l;
        node.vy += y * quad.value * alpha / l;
      }
      return true;
    }

    // Otherwise, process points directly.
    else if (quad.length || l >= distanceMax2) return;

    // Limit forces for very close nodes; randomize direction if coincident.
    if (quad.data !== node || quad.next) {
      if (x === 0) {
        x = jiggle(random);
        l += x * x;
      }
      if (y === 0) {
        y = jiggle(random);
        l += y * y;
      }
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }

    do if (quad.data !== node) {
      w = strengths[quad.data.index] * alpha / l;
      node.vx += x * w;
      node.vy += y * w;
    } while (quad = quad.next);
  }
}

function multibody_force(nodes) {
  let strengths = new Array(nodes.length).fill(global_strength);
  let out_nodes = nodes.map((node, i) => ({ x: node.x, y: node.y, index: i, vx: 0, vy: 0 }));

  let tree = quadtree(out_nodes, (n) => (n.x), (n) => (n.y)).visitAfter(accumulate(strengths));
  out_nodes.forEach((node) => {
    tree.visit(apply(node, strengths))
  });
  // out_nodes.forEach((node) => { console.log(node.vx, node.vy) });
  const retval = out_nodes.map((n) => ({ vx: n.vx, vy: n.vy }));
  return retval;
}


function App() {
  const listNodes = [{ x: 20, y: 20 }, { x: 50, y: 70 }, { x: 80, y: 20 }]
  const forces = [
    (nodes) => { return nodes.map((node) => ({ vx: -(node.x - 50) * 0.01, vy: -(node.y - 50) * 0.01 })) }
    //,multibody_force
  ]



  return (
    <div className="App">
      <header className="App-header">

        <p></p>
        <GraphSvg nodes={listNodes} velocityDecay="0.6" forces={forces}></GraphSvg>
      </header>
    </div>
  );
}

export default App;
