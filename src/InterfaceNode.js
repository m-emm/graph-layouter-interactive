import LockIcon from "./LockIcon";

function InterfaceNode({x,y,index,name,locked,radius}) {
    const lock_icon = locked ? <LockIcon x={x+radius*0.1} y={y-radius*0.7} radius={radius*0.15} id={"locker_node_"+index} /> : null;
    const textX = x;
    const textY = y+radius*0.6;
    const backgroundWidth = name.length*9;
    return(
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <g>
            <rect className="text-background" x={textX-backgroundWidth/2} y={textY-0.31*radius} width={backgroundWidth} height={radius*0.6} fill="white" />
            <circle className="node-circle" cx={x} cy={y} r={radius*0.3}   id={"node_"+index}/>
            <text id={"node_"+index} x={x} y={y} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_"+index} x={x} y={textY} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
            {lock_icon}


        </g>
    )
}

export default InterfaceNode;