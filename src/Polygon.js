const Polygon = ({ x, y, vertices, className, size }) => {
    const boundingBox = vertices.reduce((box, vertex) => {
        if (vertex.x < box.xmin) {
            box.xmin = vertex.x;
        }
        if (vertex.x > box.xmax) {
            box.xmax = vertex.x;
        }
        if (vertex.y < box.ymin) {
            box.ymin = vertex.y;
        }
        if (vertex.y > box.ymax) {

            box.ymax = vertex.y;
        }
        return box;
    }, { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity });


    const polygonSize = Math.max(boundingBox.xmax - boundingBox.xmin, boundingBox.ymax - boundingBox.ymin);
    const scale = size / polygonSize;
    const translateTransform = "translate(" + x + "," + y + ")";
    const scaleTransform = "scale(" + scale + "," + scale + ")";

    const path = vertices.map((vertex, i) => {
        if (i == 0) {
            return "M " + vertex.x + " " + vertex.y;
        } else {
            return "L " + vertex.x + " " + vertex.y;
        }
    }).join(" ") + " Z";

    return (
        <g transform={translateTransform}  >
            <g transform={scaleTransform}>
                <path className={className} d={path} />
            </g>
        </g>
    )
}

const getLineIntersection = (line1, line2) => {
    const x1 = line1.x1;
    const y1 = line1.y1;
    const x2 = line1.x2;
    const y2 = line1.y2;
    const x3 = line2.x1;
    const y3 = line2.y1;
    const x4 = line2.x2;
    const y4 = line2.y2;
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator == 0) {
        return null;
    }
    const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
    const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;
    if (x < Math.min(x1, x2) || x > Math.max(x1, x2) || x < Math.min(x3, x4) || x > Math.max(x3, x4)) {
        return null;
    }
    if (y < Math.min(y1, y2) || y > Math.max(y1, y2) || y < Math.min(y3, y4) || y > Math.max(y3, y4)) {
        return null;
    }
    return { x, y };
}


const getIntersectingPointsLocal = (line,vertices) => {
    const intersectingPoints = [];
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const intersect = getLineIntersection(line, { x1: vertices[i].x, y1: vertices[i].y, x2: vertices[j].x, y2: vertices[j].y });
        if (intersect) {
            intersectingPoints.push(intersect);
        }
    }
    return intersectingPoints;
}


const isPointInPolygonLocal = (polygon,point) => {
    let inside = false;
    for (let i = 0, j = polygon.vertices.length - 1; i < polygon.vertices.length; j = i++) {
        const xi = polygon.vertices[i].x, yi = polygon.vertices[i].y;
        const xj = polygon.vertices[j].x, yj = polygon.vertices[j].y;
        const intersect = ((yi > point.y) != (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}


const    isPointInPolygon = (polygon,point) =>  {
    const pointInPolygonSpace = {
        x: (point.x - polygon.x) / polygon.scale,
        y: (point.y - polygon.y) / polygon.scale
    }
    return isPointInPolygonLocal(polygon,pointInPolygonSpace);
}

const getIntersectingPoints = (vertices,line,polygon) => {
    const lineInPolygonSpace = {
        x1: (line.x1 - polygon.x) / polygon.scale,
        y1: (line.y1 - polygon.y) / polygon.scale,
        x2: (line.x2 - polygon.x) / polygon.scale,
        y2: (line.y2 - polygon.y) / polygon.scale
    }
    return getIntersectingPointsLocal(lineInPolygonSpace,vertices);
}

export { getIntersectingPoints,isPointInPolygon ,Polygon};

export default Polygon;