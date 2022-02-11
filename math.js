export class Vector {
  #xs;
  constructor(xs) {
    this.#xs = xs;
  }

  get(i) {
    return this.#xs[i];
  }

  add(vector) {
    return new Vector(this.#xs.map((x, i) => x + vector.get(i)));
  }

  subtract(vector) {
    return new Vector(this.#xs.map((x, i) => x - vector.get(i)));
  }

  multiply(scalar) {
    return new Vector(this.#xs.map((x) => x * scalar));
  }

  divide(scalar) {
    return new Vector(this.#xs.map((x) => x / scalar));
  }

  dot(vector) {
    return this.#xs.reduce((acc, x, i) => acc + x * vector.get(i), 0);
  }

  cross(vector) {
    if (this.size() !== 3 || vector.size() !== 3) {
      throw Error("Cross Product can only be applied to 3D Vectors");
    }
    const [v1, v2, v3] = this.toArray();
    const [w1, w2, w3] = vector.toArray();
    return v(v2 * w3 - v3 * w2, v3 * w1 - v1 * w3, v1 * w2 - v2 * w1);
  }

  hadamard(vector) {
    return new Vector(this.#xs.map((x, i) => x * vector.get(i)));
  }

  length() {
    return Math.sqrt(this.dot(this));
  }

  size() {
    return this.#xs.length;
  }

  normalised() {
    return this.divide(this.length());
  }

  extend(xs) {
    return new Vector([...this.#xs, xs]);
  }

  toArray() {
    return this.#xs;
  }
}

export const v = (...xs) => new Vector(xs);

export class Matrix {
  #rows;
  constructor(rows) {
    this.#rows = rows;
  }

  get(i) {
    return this.#rows[i];
  }

  static identity(length) {
    return new Matrix(
      Array.from({ length })
        .map((_, i) =>
          Array.from({ length }).map((_, j) => (i === j ? 1.0 : 0.0))
        )
        .map((row) => new Vector(row))
    );
  }

  transpose() {
    const matrix = this.toArray();
    return new Matrix(
      matrix[0]
        .map((_, i) => matrix.map((row) => row[i]))
        .map((row) => new Vector(row))
    );
  }

  multiplyVector(vector) {
    return new Vector(this.#rows.map((row) => row.dot(vector)));
  }

  multiplyMatrix(matrix) {
    const vectors = matrix.transpose();
    return new Matrix(
      this.#rows.map((_, i) => this.multiplyVector(vectors.get(i)))
    ).transpose();
  }

  toArray() {
    return this.#rows.map((row) => row.toArray());
  }
}

export const m = (...rows) => new Matrix(rows);

export const toRadians = (x) => (x / 180) * Math.PI;
