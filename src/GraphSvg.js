import React, { useState, useEffect } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';


function GraphSvg({ nodes, velocityDecay, forces }) {


    const [nodesMechanics, setNodesMechanics] = useState(nodes.map((node) => { return { x: node.x, y: node.y, vx: 0, vy: 0, fx: 0, fy: 0, fixed: { x: null, y: null } } }))



    function handleStep() {

        const newNodesMechanics = function (currentNodesMechanics) {
            return currentNodesMechanics.map(
                (node) => {                 
                const velocity = forces.reduce((velocity, force) => {
                        const currentVelocity = force(node);
                        return { vx: velocity.vx + currentVelocity.vx, vy: velocity.vy + currentVelocity.vy }
                    }, { vx: 0, vy: 0 });
                 return { x: node.x + ( node.vx + velocity.vx), 
                    y: node.y +(  node.vy + velocity.vy), 
                    vx: (node.vx + velocity.vx) * velocityDecay, 
                    vy: (node.vy + velocity.vy) * velocityDecay, 
                    fx: node.fx, 
                    fy: node.fy, 
                    } 
                })
        };
        setNodesMechanics(newNodesMechanics);
    }

    useEffect(() => {
        const my_timer = interval(() => {
            handleStep();
            console.log("node positions: " + nodesMechanics.map((node) => { return node.x + " " + node.y + " " }))
        }, 10);
        return () => my_timer.stop();
    }, []);

    const listNodes = nodesMechanics.map((node) =>
        <GraphNode x={node.x} y={node.y} />
    );
    return (
        <div className="GraphSvg">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                {listNodes}
            </svg>
        </div>

    )
}

export default GraphSvg;