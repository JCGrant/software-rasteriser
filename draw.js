import { v, m, toRadians } from "./math.js";
import { Transform } from "./transform.js";

export class Camera {
  #transform;
  constructor(transform = undefined) {
    this.#transform = transform ?? Transform.identity();
  }

  position() {
    const [x, y, z] = this.#transform.apply(v(0, 0, 0, 1)).toArray();
    return v(x, y, z);
  }
}

export class Renderer {
  #width;
  #height;
  #camera;
  #ctx;
  #meshes;
  #lights;
  #projectionMatrix;

  constructor(canvas, width, height, camera) {
    canvas.width = width;
    canvas.height = height;
    this.#width = width;
    this.#height = height;
    this.#camera = camera;
    this.#ctx = canvas.getContext("2d");
    this.#meshes = [];
    this.#lights = [];

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

  add_light(light) {
    this.#lights.push(light);
    return light;
  }

  render() {
    this.#clear();
    for (const mesh of this.#meshes) {
      const transformedTriangles = mesh.triangles
        .map((t) => {
          const transformedTriangle = t.map((point) =>
            mesh.transform.apply(point)
          );
          return transformedTriangle;
        })
        .sort((t1, t2) => {
          const z1 = (t1[0].get(2) + t1[1].get(2) + t1[2].get(2)) / 3.0;
          const z2 = (t2[0].get(2) + t2[1].get(2) + t2[2].get(2)) / 3.0;
          return z2 - z1;
        });

      for (const transformedTriangle of transformedTriangles) {
        const [p1, p2, p3] = transformedTriangle;
        const line1 = p2.subtract(p1);
        const line2 = p3.subtract(p1);
        const normal = line1.cross(line2).normalised();

        if (normal.dot(p1.subtract(this.#camera.position())) < 0) {
          let lightIntensity = 0;
          for (const light of this.#lights) {
            lightIntensity += Math.max(0.1, light.normalised().dot(normal));
          }
          const color = increase_brightness(mesh.color, lightIntensity * 50);

          this.#drawTriangle(
            transformedTriangle.map((transformedPoint) => {
              const projectedPoint = this.#project(transformedPoint);
              const scaledPoint = projectedPoint
                .add(v(1.0, 1.0, 0.0))
                .hadamard(v(0.5 * this.#width, 0.5 * this.#height, 0));
              return scaledPoint;
            }),
            color
          );
        }
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

  #drawTriangle(triangle, color = "#000000") {
    const [[x1, y1], [x2, y2], [x3, y3]] = triangle.map((point) =>
      point.toArray()
    );
    this.#ctx.fillStyle = color;
    this.#ctx.strokeStyle = color;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x3, y3);
    this.#ctx.lineTo(x1, y1);
    this.#ctx.lineTo(x2, y2);
    this.#ctx.lineTo(x3, y3);
    this.#ctx.fill();
    this.#ctx.stroke();
  }
}

function increase_brightness(hex, percent) {
  hex = hex.replace("#", "");
  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  return (
    "#" +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).slice(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).slice(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).slice(1)
  );
}
