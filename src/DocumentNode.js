import LockIcon from "./LockIcon";
import Polygon from "./Polygon";

function DocumentNode({x,y,index,name,locked,radius}) {
    const lock_icon = locked ? <LockIcon x={x-radius*2} y={y-radius*0.8} radius={radius*0.15} id={"locker_node_"+index} /> : null;
    const width = 5*radius;
    const height = 1*radius;
    const points = "" + (x-width*0.5 + height*0.5) + "," + (y-height*0.5) + " " + (x+width*0.5) + "," + (y-height*0.5) + " " + (x+width*0.5) + "," + (y+height*0.5)  + " " + (x-width*0.5) + "," + (y+height*0.5) + " " + (x-width*0.5) + "," + (y)   + " " + (x-width*0.5+height*0.5) + "," + (y-height*0.5)   + " " + (x-width*0.5+height*0.5) + "," + (y-height*0.5);
    const points_corner = "" + (x-width*0.5 + height*0.5) + "," + (y-height*0.5) + " " + (x-width*0.5 + height*0.5) + "," + (y) + " " + (x-width*0.5) + "," + (y) + " " + (x-width*0.5+height*0.5) + "," + (y-height*0.5);
    const vertices = [{x:-width*0.5+height*0.5, y:-height*0.5}, {x:width*0.5, y:-height*0.5}, {x:width*0.5, y:+height*0.5}, {x:-width*0.5, y:height*0.5}, {x:-width*0.5, y:0}, {x:-width*0.5+height*0.5, y:-height*0.5}, {x:-width*0.5+height*0.5, y:-height*0.5 }]
    const polygon = <Polygon x={x} y={y} size={width*1.5} vertices={vertices} className="document-path"  />
    

    return(
        // <circle cx={x} cy={y} r="10" stroke="black" strokeWidth="1" fill={fill} onClick={(e) => onClick(index,e)}  onDrag={(e) => onDrag(index,e)} />
        <g>
            <polyline className="node-circle" points={points}  id={"node_"+index}/>
            <polyline  points={points_corner} fill="none" stroke="black" id={"node_"+index} strokeWidth="0.5px"/>


            {lock_icon}
            <text id={"node_"+index} x={x} y={y-radius*0.5} className="node-id" textAnchor="middle" alignmentBaseline="middle">{index}</text>
            <text id={"node_"+index} x={x} y={y} className="node-name" textAnchor="middle" alignmentBaseline="middle">{name}</text>
            {polygon}
        </g>
    )
}

const getIntersectingPoints = () => [];
export {getIntersectingPoints};

export default DocumentNode;