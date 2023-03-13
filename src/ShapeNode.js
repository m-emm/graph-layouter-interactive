import LockIcon from "./LockIcon";
import Polygon from "./Polygon";
import { asSvgMatrix, transformationMatrix, boundingBox } from "./geometry"

function ShapeNode({ x, y, index, name, locked, shape, size, textYOffset }) {
    const box = boundingBox(shape);
    const width = box.width;
    const height = box.height;
    const lockSize = size * 6;
    const lock_icon = locked ? <LockIcon x={x - width / 2+2*lockSize} y={y - height / 2 + 0.5 * size} radius={size * 6} id={"locker_node_" + index} /> : null;
    const transformMatrix = transformationMatrix(x, y, size);
    const transform = asSvgMatrix(transformMatrix);
    const polygon = <Polygon transform={transform} vertices={shape} className="node-border" id={"node_" + index} />
    const nameLength = name.length *8;
    const textBackground = textYOffset > 0 ? <rect x={x-nameLength/2} y={y + textYOffset-height*0.25} width={nameLength} height={height * 0.5} fill="white" stroke="none" /> : null;

    return (
        <g>
            {polygon}
            {lock_icon}
            

            {textBackground}
            <text id={"node_" + index} x={x} y={y - size * 0.5 + textYOffset} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text> : null;
            <text id={"node_" + index} x={x} y={y + textYOffset} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
        </g>
    )
}


export default ShapeNode;