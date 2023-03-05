function GraphNode({x,y,index,locked}) {
    let fill = "red";
    if (locked) {
        fill = "blue";
    }
    return(
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} id={"node_"+index}/>
    )
}

export default GraphNode;