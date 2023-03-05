import React, { useState, useEffect, useRef } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';


function GraphSvg({ nodes, velocityDecay, forces }) {

    const svgRootRef = useRef(null);

    const [nodesMechanics, setNodesMechanics] = useState(nodes.map((node, i) => { return { x: node.x, y: node.y, vx: 0, vy: 0, fx: 0, fy: 0, index: i, locked: false } }))
    const [dragging, setDragging] = useState(false);
    const [dragStartCoords, setDragStartCoords] = useState({ click: { x: 0, y: 0 }, node: {} });
    const [currentSVGParams, setCurrentSVGParams] = useState({ x: 0, y: 0, scale: 1 });
    const [currentDragPosition, setCurrentDragPosition] = useState({ x: 0, y: 0 });
    const [draggedNodeIndex, setDraggedNodeIndex] = useState(-1);


    function screenToSVG(screenX, screenY) {
        const svg = svgRootRef.current;
        var p = svg.createSVGPoint()
         p.x = screenX
         p.y = screenY
         return p.matrixTransform(svg.getScreenCTM().inverse());
     }
     
     function SVGToScreen(svgX, svgY) {
        const svg = svgRootRef.current;
        var p = svg.createSVGPoint()
         p.x = svgX
         p.y = svgY
         return p.matrixTransform(svg.getScreenCTM());
     }
     

    function handleStep() {

        const newNodesMechanics = function (currentNodesMechanics) {
            const velocitiesRaw = forces.map((force) => { return force(currentNodesMechanics) })
            const velocities = velocitiesRaw.reduce((acc, val) => { return acc.map((v, i) => { return { vx: v.vx + val[i].vx, vy: v.vy + val[i].vy } }) })
            // console.log("There are " + velocities.length + " velocities")


            // .reduce((acc, val) => { return acc.map((v, i) => { return { vx: v.vx + val[i].vx, vy: v.vy + val[i].vy } }) })

            return currentNodesMechanics.map(
                (node, i) => {

                    return {
                        x: node.locked ? node.fx : node.x + (node.vx + velocities[i].vx),
                        y: node.locked ? node.fy : node.y + (node.vy + velocities[i].vy),
                        vx: (node.vx + velocities[i].vx) * velocityDecay,
                        vy: (node.vy + velocities[i].vy) * velocityDecay,
                        fx: node.fx,
                        fy: node.fy,
                        index: node.index,
                        locked: node.locked

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

    function lockNode(index) {
        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) {
                return { x: node.x, y: node.x, vx: node.vx, vy: node.vy, fx: node.x, fy: node.x, index: node.index, locked: true }
            } else {
                return node
            }
        })
        setNodesMechanics(newNodesMechanics);

    }

    function nodeClicked(index, e) {
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

    function nodeDragged(index, e) {
        if (!dragging) return;
        setCurrentDragPosition({ x: e.clientX, y: e.clientY });        
        const currentDragSVG = screenToSVG(e.clientX, e.clientY);

        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) {
                console.log("Node " + index + " found")
                const x = dragStartCoords.node.x + (currentDragSVG.x - dragStartCoords.click.x);
                const y = dragStartCoords.node.y + (currentDragSVG.y - dragStartCoords.click.y);

                return { x: x, y: y, vx: 0, vy: 0, fx: x, fy: y, index: node.index, locked: node.locked }
            } else {
                return node;
            }
        });
        setNodesMechanics(newNodesMechanics);
    }

    function nodeIndexFromEvent(e) {
        if (e.target.id.startsWith("node_")) {
            return parseInt(e.target.id.split("_")[1]);
        }
        return null;
    }

    function grab(e) {
        if(dragging) return;
        const nodeIndex = nodeIndexFromEvent(e);
        if (nodeIndex !== null) {
            setDraggedNodeIndex(nodeIndex);
            setDragging(true);
            const currentDragSVG = screenToSVG(e.clientX, e.clientY);

            setDragStartCoords({ click: { x: currentDragSVG.x, y: currentDragSVG.y }, node: nodesMechanics[nodeIndex] });
            lockNode(nodeIndex);

            
            setCurrentDragPosition({ x: e.clientX, y: e.clientY });

        }
    }

    function drag(e) {
        nodeDragged(draggedNodeIndex, e);

    }

    function drop(e) {
        console.log("dropped " + e.target.id)
        setDragging(false);
    }

    const listNodes = nodesMechanics.map((node) =>
        <GraphNode x={node.x} y={node.y} index={node.index} locked={node.locked} />
    );
    return (
        <div className="GraphSvg">
            <div>
                <svg ref={svgRootRef} width="1000" height="800" viewBox="0 0 100 100" onMouseDown={(e) => grab(e)} onMouseMove={(e) => drag(e)} onMouseUp={(e) => drop(e)}>
                    <rect id='BackDrop' x='-10%' y='-10%' width='110%' height='110%' fill='none' pointerEvents='all' />
                    {listNodes}
                    <circle cx={dragStartCoords.node.x} cy={dragStartCoords.node.y} r="1" fill="green" />
                </svg>
            </div>
            <div>
                Dragging: {dragging ? "true" : "false"}
                <p></p>
                Dragging start: {dragStartCoords.click.x} {dragStartCoords.click.y}
                <p></p>
                currentSVGParams: {currentSVGParams.x} {currentSVGParams.y} {currentSVGParams.scale}
                <p></p>
                currentDragPosition: {currentDragPosition.x} {currentDragPosition.y} delta: {currentDragPosition.x - dragStartCoords.click.x} {currentDragPosition.y - dragStartCoords.click.y}
            </div>

        </div>


    )
}

export default GraphSvg;