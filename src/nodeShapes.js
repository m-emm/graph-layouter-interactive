import { centerAndScalePoints } from "./geometry";

const nodeShapeDefault = (aspectRatio) => {
  const xMax = (aspectRatio || 4);
  return centerAndScalePoints([
    { x: 0, y: 0 },
    { x: xMax, y: 0 },
    { x: xMax, y: 1 },
    { x: 0, y: 1 },
  ])
};

const nodeShapeDocument = (aspectRatio) => {
  const xMax = (aspectRatio || 4) - 0.5;
  return centerAndScalePoints([
    { x: 0, y: -0.5 },
    { x: xMax, y: -0.5 },
    { x: xMax, y: 0.5 },
    { x: -0.5, y: 0.5 },
    { x: -0.5, y: 0 },
    { x: 0, y: -0.5 },
    { x: 0, y: -0.5 },
  ])
};

const nodeShapeInterface = (aspectRatio) => {
  const numPoints = 20;
  const radius = 1 / 8 * 0.8;
  const yOffset = 0;
  return Array(numPoints).fill(0).map((_, i) => {
    const angle = i * 2 * Math.PI / numPoints;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle) + yOffset;
    return { x, y };
  }
  )
};

const nodeShapeComputationNode = (aspectRatio) => {
  const xMax = aspectRatio;
  return centerAndScalePoints([
    { x: xMax * 0.1, y: 0 },
    { x: xMax, y: 0 },
    { x: xMax, y: 0.5 },
    { x: xMax * 0.9, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 0.5 },
  ])
};

const nodeShapeFromName = (nodeType, aspectRatio) => {
  switch (nodeType) {
    case "document":
      return nodeShapeDocument(aspectRatio);
    case "computation-node":
      return nodeShapeComputationNode(aspectRatio);
    case "interface":
      return nodeShapeInterface(aspectRatio);
    default:
      return nodeShapeDefault(aspectRatio);
  }
};

const arrowHead = (line, position, size) => {
  const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
  const x1 = position.x - size * Math.cos(angle - Math.PI / 6);
  const y1 = position.y - size * Math.sin(angle - Math.PI / 6);
  const x2 = position.x - size * Math.cos(angle + Math.PI / 6);
  const y2 = position.y - size * Math.sin(angle + Math.PI / 6);
  return [{ x: x1, y: y1 }, { x: x2, y: y2 }, { x: position.x, y: position.y }];
}

export { nodeShapeFromName, arrowHead };