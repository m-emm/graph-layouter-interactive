import LockIcon from "./LockIcon";

function ComputationNode({ x, y, index, name, locked, radius }) {
    const lock_icon = locked ? <LockIcon x={x - radius} y={y - radius * 0.8} radius={radius * 0.15} id={"locker_node_" + index} /> : null;
    const shift = 0.5 * radius;
    const cartesianProduct = (a, b) =>
        a.reduce((p, x) => [...p, ...b.map(y => [x, y])], []);

    const width = 2*radius;

    const cube_lines = cartesianProduct([0, 1], [0, 1]).map((p, i) => {
        const x1 = x - 1 * radius + p[0] * width;
        const y1 = y - radius +p[1] * width;
        const x2 = x1 + shift ;
        const y2 = y1 - shift ;
        if (i == 2 || i == 3 || i == 0) {
            return <line key={"line"+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="1" />
        }
    }).filter((l) => l != null);

    return (
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <g>
            <rect className="node-circle" x={x - 1 * radius + shift} y={y - radius - shift} width={width} height={width} fill="white" id={"node_" + index} />
            {cube_lines}

            <rect className="node-circle" x={x - 1 * radius} y={y - radius} width={width} height={width} fill="white" id={"node_" + index} />
            {lock_icon}
            <text id={"node_" + index} x={x} y={y - radius * 0.5} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_" + index} x={x} y={y} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
        </g>
    )
}

export default ComputationNode;