import LockIcon from "./LockIcon";

function GraphNode({x,y,index,name,locked,width,height}) {
    const lock_icon = locked ? <LockIcon x={x-width/2} y={y-height*0.5} radius={width*0.03} id={"locker_node_"+index} /> : null;
    return(
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <g>
            <rect className="node-circle" x={x-width*0.5}  y={y-height*0.5} width={width} height={height}  fill="white"  id={"node_"+index}/>
            {lock_icon}
            <text id={"node_"+index} x={x} y={y-height*0.25} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_"+index} x={x} y={y} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
        </g>
    )
}

export default GraphNode;