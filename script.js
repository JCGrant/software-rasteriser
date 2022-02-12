import { v } from "./math.js";
import { Camera, Renderer } from "./draw.js";
import { Transform } from "./transform.js";

const width = 800;
const height = 600;
const canvas = document.getElementById("canvas");
const camera = new Camera();
const renderer = new Renderer(canvas, width, height, camera);

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

const meshes = [];
for (let i = 0; i < 12; i++) {
  meshes.push(
    renderer.add_mesh({
      triangles: cubeTriangles,
      transform: Transform.identity(),
      color: Math.floor(Math.random() * 16777215).toString(16),
    })
  );
}

const shipMesh = await fetch("./ship.obj")
  .then((res) => res.text())
  .then((text) => {
    const lines = text.split("\n");
    const vertices = [];
    const triangles = [];
    for (const line of lines) {
      if (line[0] === "v") {
        const coords = line
          .slice(2)
          .split(" ")
          .map((x) => parseFloat(x));
        const vertex = v(...coords);
        vertices.push(vertex);
      }
      if (line[0] === "f") {
        const triangle = line
          .slice(2)
          .split(" ")
          .map((x) => parseInt(x) - 1)
          .map((index) => vertices[index])
          .map((vertex) => vertex.toArray())
          .map(([x, y, z]) => v(x, -y, -z));
        triangles.push(triangle);
      }
    }
    return renderer.add_mesh({
      triangles,
      transform: Transform.identity(),
      color: Math.floor(Math.random() * 16777215).toString(16),
    });
  });

renderer.add_light(v(0.0, 0.0, -1.0));

let time = 0.0;
const update = () => {
  for (let i = 0; i < meshes.length; i++) {
    meshes[i].transform = Transform.identity()
      .rotateZ(time)
      .rotateX(time / 2)
      .translate(
        v(
          Math.sin((2 * Math.PI * i) / 12) * 3,
          Math.cos((2 * Math.PI * i) / 12) * 3,
          5
        )
      );
    shipMesh.transform = Transform.identity()
      .rotateZ(time)
      .rotateX(time / 2)
      .translate(
        v(
          Math.sin((2 * Math.PI * i) / 12) * 3,
          Math.cos((2 * Math.PI * i) / 12) * 3,
          10
        )
      );
  }
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
