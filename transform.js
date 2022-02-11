import { m, v, Matrix } from "./math.js";

export class Transform {
  #matrix;
  constructor(matrix) {
    this.#matrix = matrix;
  }

  static identity() {
    return new Transform(Matrix.identity(4));
  }

  translate(vector) {
    return new Transform(
      m(
        v(1, 0, 0, vector.get(0)),
        v(0, 1, 0, vector.get(1)),
        v(0, 0, 1, vector.get(2)),
        v(0, 0, 0, 1)
      ).multiplyMatrix(this.#matrix)
    );
  }

  scale(vector) {
    return new Transform(
      m(
        v(vector.get(0), 0, 0, 0),
        v(0, vector.get(1), 0, 0),
        v(0, 0, vector.get(2), 0),
        v(0, 0, 0, 1)
      ).multiplyMatrix(this.#matrix)
    );
  }

  rotateX(radians) {
    return new Transform(
      m(
        v(1, 0, 0, 0),
        v(0, Math.cos(radians), Math.sin(radians), 0),
        v(0, -Math.sin(radians), Math.cos(radians), 0),
        v(0, 0, 0, 1)
      ).multiplyMatrix(this.#matrix)
    );
  }

  rotateY(radians) {
    return new Transform(
      m(
        v(Math.cos(radians), 0, Math.sin(radians), 0),
        v(0, 1, 0, 0),
        v(-Math.sin(radians), 0, Math.cos(radians), 0),
        v(0, 0, 0, 1)
      ).multiplyMatrix(this.#matrix)
    );
  }

  rotateZ(radians) {
    return new Transform(
      m(
        v(Math.cos(radians), Math.sin(radians), 0, 0),
        v(-Math.sin(radians), Math.cos(radians), 0, 0),
        v(0, 0, 1, 0),
        v(0, 0, 0, 1)
      ).multiplyMatrix(this.#matrix)
    );
  }

  apply(vector) {
    const extendedPoint = vector.extend([1]);
    const [x, y, z] = this.#matrix.multiplyVector(extendedPoint).toArray();
    return v(x, y, z);
  }
}
