const Polygon = ({ x, y, vertices, className,id }) => {
 

  const path =
    vertices
      .map((vertex, i) => {
        if (i == 0) {
          return "M " + vertex.x + " " + vertex.y;
        } else {
          return "L " + vertex.x + " " + vertex.y;
        }
      })
      .join(" ") + " Z";
    return (
          <path className={className} d={path} id={id} />
      
    );
};


export default Polygon;
