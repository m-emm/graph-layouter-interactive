import LockIcon from "./LockIcon";
import  Polygon  from "./Polygon";
import { asSvgMatrix,transformationMatrix } from "./geometry"

function ShapeNode({x,y,index,name,locked,shape,size}) {
    const lock_icon = locked ? <LockIcon x={x-size*2} y={y-size*0.8} radius={size*0.15} id={"locker_node_"+index} /> : null;
    const transformMatrix = transformationMatrix(x,y,size);
    const transform = asSvgMatrix( transformMatrix);
    const polygon = <Polygon transform={transform} vertices={shape} className="document-path" id={"node_" + index}  />

    return(
        <g>
            {polygon}
            {lock_icon}
            <text id={"node_"+index} x={x} y={y-size*0.5} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_"+index} x={x} y={y} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
        </g>
    )
}


export default ShapeNode;