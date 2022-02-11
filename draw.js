import { v, m, toRadians } from "./math.js";

export class Renderer {
  #width;
  #height;
  #ctx;
  #meshes;
  #projectionMatrix;

  constructor(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    this.#width = width;
    this.#height = height;
    this.#ctx = canvas.getContext("2d");
    this.#meshes = [];

    const near = 0.1;
    const far = 100;
    const fov = 90.0;
    const aspectRatio = height / width;
    const inverseTan = 1.0 / Math.tan(toRadians(fov / 2));

    this.#projectionMatrix = m(
      v(aspectRatio * inverseTan, 0, 0, 0),
      v(0, inverseTan, 0, 0),
      v(0, 0, far / (far - near), (-far * near) / (far - near)),
      v(0, 0, 1, 0)
    );
  }

  add_mesh(mesh) {
    this.#meshes.push(mesh);
    return mesh;
  }

  render() {
    this.#clear();
    for (const mesh of this.#meshes) {
      for (const t of mesh.triangles) {
        this.#drawTriangle(
          t.map((point) => {
            const transformedPoint = mesh.transform.apply(point);
            const projectedPoint = this.#project(transformedPoint);
            const scaledPoint = projectedPoint
              .add(v(1.0, 1.0, 0.0))
              .hadamard(v(0.5 * this.#width, 0.5 * this.#height, 0));
            return scaledPoint;
          })
        );
      }
    }
  }

  #project(point) {
    const extendedPoint = point.extend([1]);
    let [x, y, z, w] = this.#projectionMatrix
      .multiplyVector(extendedPoint)
      .toArray();
    if (w !== 0) {
      x /= w;
      y /= w;
    }
    return v(x, y, z);
  }

  #clear() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
  }

  #drawTriangle(triangle) {
    const [[x1, y1], [x2, y2], [x3, y3]] = triangle.map((point) =>
      point.toArray()
    );
    this.#ctx.beginPath();
    this.#ctx.moveTo(x3, y3);
    this.#ctx.lineTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.lineTo(x3, y3);
    this.#ctx.stroke();
  }
}
