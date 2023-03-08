import { quadtree } from "d3-quadtree";

const a = 1664525;
const c = 1013904223;
const m = 4294967296; // 2^32
let s = 1;

const strengthScale = 0.1;

function lcg() {
    return () => (s = (a * s + c) % m) / m;
}
const random = lcg;

function jiggle(random) {
    const aRandomNumber = random()();
    const retval = (aRandomNumber - 0.5) * 1e-6;
    return retval;
}

function apply(node, strength, xi, yi, ri2) {

    return function (quad, x0, y0, x1, y1) {
        const data = quad.data;
        let rj = quad.r;
        let r = node.r + rj;
        if (data) {
            if (data.index > node.index) {
                let x = xi - data.x - data.vx;
                let y = yi - data.y - data.vy;
                let l = x * x + y * y;
                if (l < r * r) {
                    if (x === 0) {
                        x = jiggle(random);
                        l += x * x;
                    }
                    if (y === 0) {
                        y = jiggle(random);
                        l += y * y;
                    }
                    const ls = (r - (l = Math.sqrt(l))) / l;;
                    x *= ls;
                    y *= ls;
                    rj *= rj;
                    r = rj / (ri2 + rj);

                    node.vx += x * r * strength * strengthScale;
                    node.vy += y * r * strength * strengthScale;
                    r = 1 - r;
                    data.vx -= x * r * strength * strengthScale;
                    data.vy -= y * r * strength * strengthScale;
                }
            }
            return;
        }
        return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
}

function prepare(quad) {
    if (quad.data) return quad.r = quad.data.r;
    for (var i = quad.r = 0; i < 4; ++i) {
        if (quad[i] && quad[i].r > quad.r) {
            quad.r = quad[i].r;
        }
    }
}

function collisionForce(strength, radiusFunction) {

    return function (nodes) {
        let out_nodes = nodes.map((node, i) => ({ x: node.x, y: node.y, index: i, vx: 0, vy: 0, r: radiusFunction(node) }));
        out_nodes = out_nodes.map((node) => ({ ...node, r2: node.r * node.r }));

        let tree = quadtree(out_nodes, (n) => (n.x), (n) => (n.y)).visitAfter(prepare);
        out_nodes.forEach((node) => {
            tree.visit(apply(node, strength, node.x, node.y, node.r2))
        });
        const retval = out_nodes.map((n) => ({ vx: n.vx, vy: n.vy }));
        return retval;
    }
}

export { collisionForce };