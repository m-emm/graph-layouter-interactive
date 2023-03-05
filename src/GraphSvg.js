import React, { useState, useEffect } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';


function GraphSvg({ nodes, velocityDecay, forces }) {


    const [nodesMechanics, setNodesMechanics] = useState(nodes.map((node,i) => { return { x: node.x, y: node.y, vx: 0, vy: 0, fx: 0, fy: 0, index:i,locked:false} }))



    function handleStep() {

        const newNodesMechanics = function (currentNodesMechanics) {
            const velocitiesRaw = forces.map((force) => { return force(currentNodesMechanics) })
            const velocities =velocitiesRaw.reduce((acc,val) => { return acc.map( (v,i) => { return {vx: v.vx +val[i].vx, vy: v.vy+val[i].vy} } ) })
            // console.log("There are " + velocities.length + " velocities")

            
                // .reduce((acc, val) => { return acc.map((v, i) => { return { vx: v.vx + val[i].vx, vy: v.vy + val[i].vy } }) })

            return currentNodesMechanics.map(
                (node, i) => {

                    return {
                        x: node.locked ?  node.fx : node.x + (node.vx + velocities[i].vx),
                        y: node.locked ?  node.fy : node.y + (node.vy + velocities[i].vy),
                        vx: (node.vx + velocities[i].vx) * velocityDecay,
                        vy: (node.vy + velocities[i].vy) * velocityDecay,
                        fx: node.fx,
                        fy: node.fy,
                        index:node.index,
                        locked:node.locked

                    }
                })
        };
        setNodesMechanics(newNodesMechanics);
    }

    useEffect(() => {
        const my_timer = interval(() => {
            handleStep();
            // console.log("node positions: " + nodesMechanics.map((node) => { return node.x + " " + node.y + " " }))
        }, 10);
        return () => my_timer.stop();
    }, []);

    function nodeClicked(index,e) {
        console.log("node " + index + " clicked")
        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) {
                if (node.locked) {
                    return { x: node.fx, y: node.fy, vx: node.vx, vy: node.vy, fx: null, fy: null, index: node.index, locked: false }
                } else {
                    return { x: node.x, y: node.y, vx: node.vx, vy: node.vy, fx: node.x, fy: node.y, index: node.index, locked: true }
                }
            }
            else {
                return node
            }
        })
        setNodesMechanics(newNodesMechanics);
    }

    function nodeDragged(index,e) {
        console.log("node " + index + " dragged " + e.clientX + " " + e.clientY)
        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) { 
                console.log("Node " + index + " found")
                return { x: e.clientX, y: e.clientY, vx: node.vx, vy: node.vy, fx: node.fx, fy: node.fy, index: node.index, locked: node.locked }    
            } else {        
                return node;
            }
        });
        setNodesMechanics(newNodesMechanics);
    }

    function grab(e) {
        console.log("grabbed " + e.target.id)
    }

    function drag(e) {
        if(e.target.id.startsWith("node_")) {
            const index = parseInt(e.target.id.split("_")[1]);
            nodeDragged(index,e);
        }
        
    }

    function drop(e) {
        console.log("dropped " + e.target.id)
    }

    const listNodes = nodesMechanics.map((node) =>
        <GraphNode x={node.x} y={node.y} index={node.index}  locked={node.locked}/>
    );
    return (
        <div className="GraphSvg">
            <svg width="1000" height="800" viewBox="0 0 100 100" onMouseDown={(e) => grab(e)} onMouseMove={(e) => drag(e)} onMouseUp={(e) => drop(e)}>
            <rect id='BackDrop' x='-10%' y='-10%' width='110%' height='110%' fill='none' pointerEvents='all' />
                {listNodes}
            </svg>
        </div>

    )
}

export default GraphSvg;