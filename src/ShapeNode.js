import LockIcon from "./LockIcon";
import { Polygon,getIntersectingPoints as getIntersectingPointsPolygon  } from "./Polygon";

function ShapeNode({x,y,index,name,locked,shape,size,nodeType}) {
    const lock_icon = locked ? <LockIcon x={x-size*2} y={y-size*0.8} radius={size*0.15} id={"locker_node_"+index} /> : null;
    const polygon = <Polygon x={x} y={y} size={size} vertices={shape} className={nodeType +"path"} />
    return(
        <g>
            {polygon}
            {lock_icon}
            <text id={"node_"+index} x={x} y={y-size*0.5} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_"+index} x={x} y={y} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
        </g>
    )
}


export {    ShapeNode}