import React, { useState, useEffect } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';


function GraphSvg({ nodes, velocityDecay, forces }) {


    const [nodesMechanics, setNodesMechanics] = useState(nodes.map((node) => { return { x: node.x, y: node.y, vx: 0, vy: 0, fx: 0, fy: 0, fixed: { x: null, y: null } } }))



    function handleStep() {

        const newNodesMechanics = function (currentNodesMechanics) {
            const velocitiesRaw = forces.map((force) => { return force(currentNodesMechanics) })
            const velocities =velocitiesRaw.reduce((acc,val) => { return acc.map( (v,i) => { return {vx: v.vx +val[i].vx, vy: v.vy+val[i].vy} } ) })
            console.log("There are " + velocities.length + " velocities")

            
                // .reduce((acc, val) => { return acc.map((v, i) => { return { vx: v.vx + val[i].vx, vy: v.vy + val[i].vy } }) })

            return currentNodesMechanics.map(
                (node, i) => {

                    return {
                        x: node.x + (node.vx + velocities[i].vx),
                        y: node.y + (node.vy + velocities[i].vy),
                        vx: (node.vx + velocities[i].vx) * velocityDecay,
                        vy: (node.vy + velocities[i].vy) * velocityDecay,
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
            <svg width="1000" height="800" viewBox="0 0 100 100">
                {listNodes}
            </svg>
        </div>

    )
}

export default GraphSvg;