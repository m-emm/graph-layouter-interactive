function GraphEdge({x1,y1,x2,y2,type,name}) {

    const class_ ="graph-edge" + (type === "dashed" ? " dashed" : "");
    const textBackground = name !== undefined ? <rect className="text-background"x={(x1+x2)/2-3} y={(y1+y2)/2-10} width={name.length*10} height="14" fill="white" /> : null;
    return (
        <g>
            <line className={class_} x1={x1} y1={y1} x2={x2} y2={y2} />
           {textBackground}
            <text className="edge-name" x={(x1+x2)/2} y={(y1+y2)/2}>{name}</text>
        </g>
    )
}

export default GraphEdge;