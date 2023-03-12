import * as R from "ramda";

const transformationMatrix = (x, y, scale, angle) => {
  if (scale === undefined) scale = 1;
  if (angle === undefined) angle = 0;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [cos * scale, -sin * scale, x, sin * scale, cos * scale, y, 0, 0, 1];
};

const transformationMatrixSkew = (x, y, xscale, yscale, angle) => {
  if (xscale === undefined) xscale = 1;
  if (yscale === undefined) yscale = 1;
  if (angle === undefined) angle = 0;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [cos * xscale, -sin * yscale, x, sin * xscale, cos * yscale, y, 0, 0, 1];
};

const transformPointWithMatrix = (point, matrix) => {
  const x = point.x * matrix[0] + point.y * matrix[1] + matrix[2];
  const y = point.x * matrix[3] + point.y * matrix[4] + matrix[5];
  return { x, y };
};

const transformPointsWithMatrix = (points, matrix) => {
  return R.map((point) => transformPointWithMatrix(point, matrix), points);
};

const transformPoints = (x, y, scale, angle) => {
  const matrix = transformationMatrix(x, y, scale, angle);
  return (points) => transformPointsWithMatrix(points, matrix);
};

const invertTransformationMatrix = (matrix) => {
  const det = matrix[0] * matrix[4] - matrix[1] * matrix[3];
  return [
    matrix[4] / det,
    -matrix[1] / det,
    (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / det,
    -matrix[3] / det,
    matrix[0] / det,
    (matrix[2] * matrix[3] - matrix[0] * matrix[5]) / det,
    0,
    0,
    1,
  ];
};

const asSvgMatrix = (matrix) => {
  return `matrix(${matrix[0]},${matrix[3]},${matrix[1]},${matrix[4]},${matrix[2]},${matrix[5]})`;
};

const getLineIntersection = (line1, line2) => {
  var x1 = line1.x1;
  var y1 = line1.y1;
  var x2 = line1.x2;
  var y2 = line1.y2;
  var x3 = line2.x1;
  var y3 = line2.y1;
  var x4 = line2.x2;
  var y4 = line2.y2;

  var ua,
    ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
  };
};

const isPointInPolygon = (polygon, point) => {
  let inside = false;
  for (let i = 0, j = polygon.vertices.length - 1; i < polygon.vertices.length; j = i++) {
    const xi = polygon.vertices[i].x,
      yi = polygon.vertices[i].y;
    const xj = polygon.vertices[j].x,
      yj = polygon.vertices[j].y;
    const intersect =
      yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const getIntersectingPoints = (line, vertices) => {
  const vertexCycle = R.concat(vertices, [vertices[0]]);

  const intersectingPoints = Array(vertices.length);  
  for (let i = 0; i < vertices.length; i++) {
    const intersect = getLineIntersection(line, {
      x1: vertices[i].x,
      y1: vertices[i].y,
      x2: vertexCycle[i+1].x,
      y2: vertexCycle[i+1].y,
    });
    if (intersect && intersect.seg1 && intersect.seg2) {
      intersectingPoints[i] = intersect;
    }
  }
  return intersectingPoints;

};

const centerAndScalePoints = (points) => {
  // calculate center of vertices
  const center = R.reduce(
    (acc, vertex) => {
      acc.x += vertex.x / points.length;
      acc.y += vertex.y / points.length;
      return acc;
    },
    { x: 0, y: 0 },
    points
  );

  const size = R.reduce(
    (acc, vertex) => {
      const dx = vertex.x - center.x;
      const dy = vertex.y - center.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > acc) acc = d;
      return acc;
    },
    0,
    points
  );

  const scale = 1 / size;
  // center and scale vertices
  return R.map((vertex) => {
    return {
      x: (vertex.x - center.x) * scale,
      y: (vertex.y - center.y) * scale,
    };
  }, points);
};

export {
  transformationMatrix,
  transformationMatrixSkew,
  transformPointWithMatrix,
  transformPointsWithMatrix,
  transformPoints,
  invertTransformationMatrix,
  asSvgMatrix,
};
export { getLineIntersection, getIntersectingPoints, isPointInPolygon, centerAndScalePoints };
