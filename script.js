import { v } from "./math.js";
import { Renderer } from "./draw.js";
import { Transform } from "./transform.js";

const width = 800;
const height = 600;
const canvas = document.getElementById("canvas");
const renderer = new Renderer(canvas, width, height);

const cubeTriangles = [
  [v(0.0, 0.0, 0.0), v(0.0, 1.0, 0.0), v(1.0, 1.0, 0.0)],
  [v(0.0, 0.0, 0.0), v(1.0, 1.0, 0.0), v(1.0, 0.0, 0.0)],

  [v(1.0, 0.0, 0.0), v(1.0, 1.0, 0.0), v(1.0, 1.0, 1.0)],
  [v(1.0, 0.0, 0.0), v(1.0, 1.0, 1.0), v(1.0, 0.0, 1.0)],

  [v(1.0, 0.0, 1.0), v(1.0, 1.0, 1.0), v(0.0, 1.0, 1.0)],
  [v(1.0, 0.0, 1.0), v(0.0, 1.0, 1.0), v(0.0, 0.0, 1.0)],

  [v(0.0, 0.0, 1.0), v(0.0, 1.0, 1.0), v(0.0, 1.0, 0.0)],
  [v(0.0, 0.0, 1.0), v(0.0, 1.0, 0.0), v(0.0, 0.0, 0.0)],

  [v(0.0, 1.0, 0.0), v(0.0, 1.0, 1.0), v(1.0, 1.0, 1.0)],
  [v(0.0, 1.0, 0.0), v(1.0, 1.0, 1.0), v(1.0, 1.0, 0.0)],

  [v(1.0, 0.0, 1.0), v(0.0, 0.0, 1.0), v(0.0, 0.0, 0.0)],
  [v(1.0, 0.0, 1.0), v(0.0, 0.0, 0.0), v(1.0, 0.0, 0.0)],
];

const cubeMesh = renderer.add_mesh({
  triangles: cubeTriangles,
  transform: Transform.identity(),
});

let time = 0.0;
const update = () => {
  cubeMesh.transform = Transform.identity()
    .rotateZ(time)
    .rotateX(time / 2)
    .translate(v(0, 0, 3));
  time += 1 / 60;
};

const slow = false;

const run = () => {
  update();
  renderer.render();
  if (!slow) {
    window.requestAnimationFrame(run);
  }
};

run();
if (slow) {
  setInterval(run, 500);
}
