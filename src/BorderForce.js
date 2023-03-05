
function borderForce(width,height,boundary,strength) {
    const strengthScale = 0.9;
    function borderForceProfile(d) {
        
        const dimensionless = Math.abs(d/boundary)
        const exponent = dimensionless < 1 ? 1 : 2 ;
        const value =  boundary * Math.pow(dimensionless,exponent)
        return d<0 ? - value : value
    }

    return function(nodes) {
        return nodes.map((node) => {
             return {
                vx: (node.x < boundary ? borderForceProfile( - ( node.x -boundary) )  : ( ( node.x > ( width- boundary) ) ? borderForceProfile( width - boundary - node.x ) : 0)) * strength*strengthScale,
                vy: (node.y < boundary ? borderForceProfile(- ( node.y- boundary )) : ( (node.y > ( height-  boundary )  ) ?  borderForceProfile(height - boundary-node.y)  : 0)) * strength*strengthScale
             }
        
        })
    }

}

export {borderForce};