
const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32
let s = 1;


function lcg() {
    return () => (s = (a * s + c) % m) / m;
}
const random = lcg;

function jiggle(random) {
    const aRandomNumber = random()();
    const retval = (aRandomNumber - 0.5) * 1e-6;
    return retval;
}

function linkForce(strength, distance,links) {
    return function (nodes) {
        let out_nodes = nodes.map((node, i) => ({ x: node.x, y: node.y, index: i, vx: 0, vy: 0 }));
        links.forEach(link => {
            const source = out_nodes[link.source];
            const target = out_nodes[link.target];
            // check if distance is a function or a value
            const current_distance = typeof distance === "function" ? distance(link,nodes) : distance;

            const x = target.x - source.x;
            const y = target.y - source.y;
            const l = Math.sqrt(x * x+ y * y );
            const force = (l - current_distance) * -strength;
            if (l !== 0) {
                target.vx += x / l * force;
                target.vy += y / l * force;
                source.vx -= x / l * force;
                source.vy -= y / l * force;
            }
        });
        const retval = out_nodes.map((n) => ({ vx: n.vx, vy: n.vy }));
        return retval;
    }
}

export { linkForce };