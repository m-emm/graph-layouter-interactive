function GraphNode({x,y,index,locked,radius}) {
    let fill = "gray";
    if (locked) {
        fill = "red";
    }
    return(
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <g>
            <circle class="node-circle" cx={x} cy={y} r={radius}   id={"node_"+index}/>
            <circle cx={x+radius*0.8} cy={y-radius*0.8} r={radius/5} stroke="black" strokeWidth="0.5" fill={fill} id={"locker_node_"+index}/>
            <text id={"node_"+index} x={x} y={y} class="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
        </g>
    )
}

export default GraphNode;