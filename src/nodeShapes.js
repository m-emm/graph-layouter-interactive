import { centerAndScalePoints } from "./geometry";  

const nodeShapeDocument = () => {

  return centerAndScalePoints( [
    { x: 0, y: -0.5 },
    { x: 2, y: -0.5 },
    { x: 2, y: 0.5 },
    { x: -0.5, y: 0.5 },
    { x: -0.5, y: 0 },
    { x: 0, y: -0.5 },
    { x: 0, y: -0.5 },
  ])
};

const nodeShapeFromName = (nodeType) => {
  switch (nodeType) {
    case "document":
      return nodeShapeDocument();
    default:
        return nodeShapeDocument();
  }
};

export {nodeShapeFromName};