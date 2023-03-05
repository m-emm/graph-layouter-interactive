import React, { useState, useEffect } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';


function GraphSvg({ nodes }) {

    const [nodesPositions, setNodePositions] = useState(nodes.map((node) => { return { x: node.x, y: node.y } }));
    const [numRuns, setNumRuns] = useState(0);

    function handleStep() {
        nodesPositions.forEach((node) => {
            console.log("BEFORE: node: " + node.x + " " + node.y)
        });

        const newNodesPositions = function () { return nodesPositions.map((node) => 
           ( { x: ( 0.5 * node.x )   , y: node.y  } ) );
        };
        newNodesPositions().forEach((node) => {
            console.log("nod AFTER: " + node.x + " " + node.y)
        });
        setNodePositions(newNodesPositions);
        console.log("Num Runs:" + numRuns);
    }

    useEffect(() => {
        const my_timer = interval(() => {
            handleStep();
            setNumRuns(() => numRuns+1)

            console.log("node positions: " + nodesPositions.map((node) => {return node.x + " " + node.y + " "}) )
        }, 500);
        return () => my_timer.stop();
    }, []);

    const listNodes = nodesPositions.map((node) =>
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