
function gridForce(xGrid, yGrid, strength) {
    const strengthScale = 0.1;
    const scale = Math.max(xGrid,yGrid)

    function borderForceProfile(d) {
        const dimensionless = Math.abs(d/scale);
        const exponent = dimensionless < 1 ? 6 : 0.1 ;
        const value =  scale * Math.pow(dimensionless,exponent)
        return d<0 ? - value : value
    }



    return function (nodes) {
        return nodes.map((node) => {
            const nearestGridX = Math.round(node.x / xGrid) * xGrid;
            const nearestGridY = Math.round(node.y / yGrid) * yGrid;
            const differenceX = node.x - nearestGridX;
            const differenceY = node.y - nearestGridY;
            const distance = Math.sqrt(differenceX * differenceX + differenceY * differenceY);
            if(distance == 0) {
                return {vx: 0, vy: 0};
            }
            return {
                vx: (differenceX / distance) * borderForceProfile(distance) *  strength * strengthScale,
                vy: (differenceY / distance) * borderForceProfile(distance) * strength * strengthScale
            }

        })
    }

}

export { gridForce };