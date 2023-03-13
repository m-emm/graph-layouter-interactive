import React, { useState, useEffect, useRef } from 'react';
import GraphNode from './GraphNode';
import { timer, interval } from 'd3-timer';
import GraphEdge from './GraphEdge';
import InterfaceNode from './InterfaceNode';
import ComputationNode from './ComputationNode';
import xmlFormat from 'xml-formatter';
import DocumentNode from './DocumentNode';
import ShapeNode from './ShapeNode';
import GraphSvg_css from './GraphSvg_css.js';
import Checkbox from './Checkbox';
import IntersectionMark from './IntersectionMark';
import { nodeShapeFromName , arrowHead} from './nodeShapes';
import { transformPoints, transformationMatrix, transformPointsWithMatrix, getIntersectingPoints } from './geometry';
import * as R from "ramda";
import Polygon from './Polygon';


function GraphSvg({ nodes, edges, velocityDecay, forces, nodeRadius, width, height, resizeCounter, gridX, gridY, boxAspecRatio }) {

    const svgRootRef = useRef(null);


    const [nodesMechanics, setNodesMechanics] = useState(nodes.map((node, i) => { return { x: node.x, y: node.y, vx: 0, vy: 0, fx: 0, fy: 0, index: i, locked: false, name: node.name, type: node.type } }))
    const [dragging, setDragging] = useState(false);
    const [dragStartCoords, setDragStartCoords] = useState({ click: { x: 0, y: 0 }, node: {} });
    const [draggedNodeIndex, setDraggedNodeIndex] = useState(-1);
    const [lockingNodeIndex, setLockingNodeIndex] = useState(-1);
    const [svgText, setSvgText] = useState("");
    const [simulationRunning, setSimulationRunning_] = useState(true);
    const [snapToGrid, setSnapToGrid] = React.useState(false);
    const [nodeNameFontSize, setNodeNameFontSize] = useState(16);
    const [edgeNameFontSize, setEdgeNameFontSize] = useState(16);

    const currentResizeCounterRef = useRef(resizeCounter);
    const oldResizeCounterRef = useRef(resizeCounter);

    const simulationRunningRef = useRef(simulationRunning);

    function setSimulationRunning(simulationRunning) {
        simulationRunningRef.current = simulationRunning;
        setSimulationRunning_(simulationRunning);
    }

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

    function saveSvgText() {
        const svg = svgRootRef.current;
        if (svg) {

            var svgCopy = new DOMParser().parseFromString(svg.outerHTML, "text/xml");
            const lockIcons = svgCopy.firstChild.getElementsByClassName("lock-icon");
            // convert lockIcons from HTMLCollection to Array
            const lockIconsArray = Array.prototype.slice.call(lockIcons);
            lockIconsArray.forEach((lockIcon) => {
                lockIcon.parentNode.removeChild(lockIcon);
            })
            const xmlText = '<?xml version="1.0"?>\n' + xmlFormat(svgCopy.firstChild.outerHTML);
            setSvgText(xmlText);
        }
    }

    function unlockAll() {
        const newNodesMechanics = nodesMechanics.map((node) => {
            return { ...node, locked: false }
        })
        setNodesMechanics(newNodesMechanics);
        setSimulationRunning(true);
    }
    function saveLayout() {
        localStorage.setItem("layout", JSON.stringify(nodesMechanics.map((node) => { return { x: node.x, y: node.y, name: node.name, fx: node.fx, fy: node.fy, locked: node.locked } })));
    }

    function doSnapToGrid() {
        const newNodesMechanics = nodesMechanics.map((node) => {
            return { ...node, x: Math.round(node.x / gridX) * gridX, y: Math.round(node.y / gridY) * gridY, fx: Math.round(node.x / gridX) * gridX, fy: Math.round(node.y / gridY) * gridY, locked: true }
        })
        setNodesMechanics(newNodesMechanics);
        setSimulationRunning(true);
    }

    function loadLayout() {
        const layout = JSON.parse(localStorage.getItem("layout"));
        if (layout) {
            const newNodesMechanics = nodesMechanics.map((node) => {
                const layoutNode = layout.find((layoutNode) => { return layoutNode.name == node.name });
                if (layoutNode) {
                    return { ...node, x: layoutNode.x, y: layoutNode.y, fx: layoutNode.fx, fy: layoutNode.fy, locked: layoutNode.locked }
                } else {
                    return node;
                }
            })
            setNodesMechanics(newNodesMechanics);
            setSimulationRunning(true);
        }
    }


    function handleStep() {
        if (oldResizeCounterRef.current !== currentResizeCounterRef.current) {
            setSimulationRunning(true);
        }
        oldResizeCounterRef.current = currentResizeCounterRef.current;

        const newNodesMechanics = function (currentNodesMechanics) {
            if (!simulationRunningRef.current) return currentNodesMechanics;
            const velocitiesRaw = forces().map((force) => { return force(currentNodesMechanics) })
            const velocities = velocitiesRaw.reduce((acc, val) => { return acc.map((v, i) => { return { vx: v.vx + val[i].vx, vy: v.vy + val[i].vy } }) })

            // filter out velocities of locked nodes
            const unlockedVelocities = velocities.map((v, i) => { return currentNodesMechanics[i].locked ? { vx: 0, vy: 0 } : v })
            // sum unlocked velocities
            const sumUnlockedVelocities = unlockedVelocities.reduce((acc, val) => { return { vx: acc.vx + val.vx, vy: acc.vy + val.vy } })
            // calculate average unlocked velocity
            const avgUnlockedVelocity = { vx: sumUnlockedVelocities.vx / unlockedVelocities.length, vy: sumUnlockedVelocities.vy / unlockedVelocities.length }
            // calculate average unlocked velocity magnitude

            const avgUnlockedVelocityMagnitude = Math.sqrt(avgUnlockedVelocity.vx * avgUnlockedVelocity.vx + avgUnlockedVelocity.vy * avgUnlockedVelocity.vy)

            // calculate maximum unlocked velocity magnitude
            const maxUnlockedVelocityMagnitude = Math.max(...unlockedVelocities.map((v) => { return Math.sqrt(v.vx * v.vx + v.vy * v.vy) }))

            // stop simulation if average unlocked velocity is below threshold
            if (maxUnlockedVelocityMagnitude < 0.1 && !dragging) {
                if (simulationRunningRef.current) {
                    console.log("simulation stopped");
                    setSimulationRunning(false);
                }
                return currentNodesMechanics;
            }

            return currentNodesMechanics.map(
                (node, i) => {

                    return {
                        ...node,
                        x: node.locked ? node.fx : (node.x + (node.dragging ? 0 : (node.vx + velocities[i].vx))),
                        y: node.locked ? node.fy : (node.y + (node.dragging ? 0 : (node.vy + velocities[i].vy))),
                        vx: (node.vx + velocities[i].vx) * velocityDecay,
                        vy: (node.vy + velocities[i].vy) * velocityDecay,
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


    function nodeClicked(index, forceLock) {
        console.log("node " + index + " clicked")
        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) {
                if (node.locked && !forceLock) {
                    return { ...node, fx: null, fy: null, locked: false, }
                } else {
                    return { ...node, fx: node.x, fy: node.y, locked: true }
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
        const currentDragSVG = screenToSVG(e.clientX, e.clientY);

        const newNodesMechanics = nodesMechanics.map((node) => {
            if (node.index === index) {
                console.log("Node " + index + " found")
                let x = dragStartCoords.node.x + (currentDragSVG.x - dragStartCoords.click.x);
                let y = dragStartCoords.node.y + (currentDragSVG.y - dragStartCoords.click.y);
                if (snapToGrid) {
                    x = Math.round(x / gridX) * gridX;
                    y = Math.round(y / gridY) * gridY;
                }

                return { ...node, x: x, y: y, vx: 0, vy: 0, fx: x, fy: y }
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
        if (dragging) return;
        setSimulationRunning(true);
        if (e.target.id.startsWith("locker_node_")) {
            setLockingNodeIndex(parseInt(e.target.id.split("_")[2]));
            return;
        }

        const nodeIndex = nodeIndexFromEvent(e);
        if (nodeIndex !== null) {
            setDraggedNodeIndex(nodeIndex);
            setDragging(true);
            const currentDragSVG = screenToSVG(e.clientX, e.clientY);

            setDragStartCoords({ click: { x: currentDragSVG.x, y: currentDragSVG.y }, node: nodesMechanics[nodeIndex] });


            setNodesMechanics(nodesMechanics.map((node) => {
                if (node.index === nodeIndex) {
                    return { ...node, vx: 0, vy: 0, fx: node.x, fy: node.y, dragging: true }
                } else {
                    return node;
                }
            }));
        }
    }

    function drag(e) {
        if (!dragging) return;
        if (lockingNodeIndex !== -1) {
            return;
        }
        setSimulationRunning(true);
        nodeDragged(draggedNodeIndex, e);

    }

    function drop(e) {
        console.log("dropped " + e.target.id)
        if (lockingNodeIndex !== -1) {
            nodeClicked(lockingNodeIndex, false);
            setLockingNodeIndex(-1);
            setSimulationRunning(true);
            return;
        }
        if (!dragging) return;

        setDragging(false);
        setDraggedNodeIndex(-1);
        setNodesMechanics(nodesMechanics.map((node) => {
            if (node.index === draggedNodeIndex) {
                return { ...node, locked: true, dragging: false }
            } else {
                return { ...node, vx: 0, vy: 0, dragging: false }
            }
        }));
        setSimulationRunning(true);
    }

    const calcNodeShape = (node) => {
        return transformPointsWithMatrix(nodeShapeFromName(node.type, boxAspecRatio), transformationMatrix(node.x, node.y, nodeRadius * boxAspecRatio));
    }

    const applicableNodeType =  (type) => { return R.includes(R.__,["document","computation-node","component","interface"])(type) || !type; } 

    const nodeBuilder = (node, i) => {
        if (node.type == "interface" && false) {
            return <InterfaceNode key={"node_" + i} x={node.x} y={node.y} index={node.index} locked={node.locked} radius={nodeRadius} name={node.name} />
        } else if (node.type == "computation-node" && false) {
            return <ComputationNode key={"node_" + i} x={node.x} y={node.y} index={node.index} locked={node.locked} radius={nodeRadius} name={node.name} />
        } else if (applicableNodeType(node.type) || !node.type) {
            const shape = calcNodeShape(node);
            // return <DocumentNode key={"node_"+i}  x={node.x} y={node.y} index={node.index} locked={node.locked} radius={nodeRadius} name={node.name} />
            // const shape = transformPointsWithMatrix(nodeShapeFromName(node.type,boxAspecRatio), transformationMatrixSkew(node.x,node.y,nodeRadius*boxAspecRatio,nodeRadius*boxAspecRatio,0) );
            return <ShapeNode key={"node_" + i} x={node.x} y={node.y} index={node.index} locked={node.locked} size={1} name={node.name} shape={shape} textYOffset={ node.type == "interface" ? nodeRadius*0.8 : 0 } />
        } else {
            return <GraphNode key={"node_" + i} x={node.x} y={node.y} index={node.index} locked={node.locked} height={nodeRadius} width={nodeRadius * boxAspecRatio} name={node.name} />
        }
    }

    const listNodes = nodesMechanics.map(nodeBuilder);
    const documentEdges = edges.filter(edge => applicableNodeType(nodesMechanics[edge.source].type) || applicableNodeType(nodesMechanics[edge.target].type));
    const intersectionMarksOnDocuments = documentEdges.map((edge, i) => {
        const source = nodesMechanics[edge.source];
        const target = nodesMechanics[edge.target];
        const line = { x1: source.x, y1: source.y, x2: target.x, y2: target.y };
        const intersectionMarks = [];
        [source, target].forEach((node) => {
            if (applicableNodeType(node.type) && edge.name =="use") {
                const shape = calcNodeShape(node);
                //            const shape = transformPointsWithMatrix(nodeShapeFromName(node.type), transformationMatrixSkew(node.x,node.y,nodeRadius*4,nodeRadius*4,0) );
                const intersectingPoints = getIntersectingPoints(line, shape);
                // intersectionMarks.push(intersectingPoints.map((point, i) => <IntersectionMark key={"intersection_" + i} x={point.x} y={point.y} />));
                if(node.index == target.index) {
                    const arrowHeadShape = (postion) =>  arrowHead(line,postion,nodeRadius * 0.3);
                    intersectionMarks.push(intersectingPoints.map((point, i) => <Polygon x={0} y={0} className="arrow-head" key={"arrowhead_" + i} id={"arrowhead_" + edge.source + "_ " + edge.target + "_" + node.index} vertices={arrowHeadShape(point)} />));
                }
            }
        });
        return intersectionMarks;
    });





    const listEdges = edges.map((edge, i) =>
        <GraphEdge key={"edge" + i} x1={nodesMechanics[edge.source].x} y1={nodesMechanics[edge.source].y} x2={nodesMechanics[edge.target].x} y2={nodesMechanics[edge.target].y} type={edge.type} name={edge.name} />
    );

    const intersectingPoints = edges.map((edge, i) => {
        const source = listNodes[edge.source];
        const target = listNodes[edge.target];
        const line = { x1: source.x, y1: source.y, x2: target.x, y2: target.y };
        if (target.getIntersectingPoints) {
            return target.getIntersectingPoints(line);
        }
        return []
    });

    const listDisplayNodes = nodesMechanics.map((node) => <li> {node.index} {node.dragging ? "dragging" : ""}</li>);

    const viewBoxString = "0 0 " + width + " " + height;

    currentResizeCounterRef.current = resizeCounter;
    return (
        <div className="GraphSvg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" ref={svgRootRef} width={width} height={height} viewBox={viewBoxString} onMouseDown={(e) => grab(e)} onMouseMove={(e) => drag(e)} onMouseUp={(e) => drop(e)}>
                    <style>{GraphSvg_css(nodeNameFontSize, edgeNameFontSize)}</style>
                    <rect id='BackDrop' x='-10%' y='-10%' width='110%' height='110%' fill='white' pointerEvents='all' />
                    <line x1="-100" y1="0" x2="5000" y2="0" stroke="white" />
                    <line x1="0" y1="-1000" x2="0" y2="5000" stroke="white" />
                    <line x1={width} y1="-1000" x2={width} y2="5000" stroke="white" />
                    <line x1="-100" y1={height} x2="5000" y2={height} stroke="white" />
                    {listEdges}

                    {listNodes}
                    {intersectionMarksOnDocuments}

                </svg>
            </div>
            <div>
                <p> Window height: {window.innerHeight} Simulation {simulationRunning ? "running" : "stopped"}</p>
                <Checkbox label="Snap to Grid" checked={snapToGrid} onCheckboxChange={(e) => setSnapToGrid(e.target.checked)} />
                <button onClick={() => doSnapToGrid()}>Snap to Grid </button>
                <button onClick={() => saveSvgText()}>Save SVG</button>
                <button onClick={() => saveLayout()}>Save Layout</button>
                <button onClick={() => loadLayout()}>Load Layout</button>
                <button onClick={() => unlockAll()}>Unlock all</button>
                <p>
                    <label>
                        Node Font Size<input name="nodeFontSizeInput" onChange={e => setNodeNameFontSize(e.target.value)} defaultValue="16" />
                    </label>
                </p>
                <p>
                    <label>
                        Edge Font Size<input name="edgeNameFontSize" onChange={e => setEdgeNameFontSize(e.target.value)} defaultValue="16" />
                    </label>
                </p>
                <p>
                    <a href-lang="image/svg+xml" href={"data:image/svg+xml;base64,\n" + btoa(svgText)} id="download" target="_blank">Download</a>
                </p>
            </div>


        </div>


    )
}

export default GraphSvg;