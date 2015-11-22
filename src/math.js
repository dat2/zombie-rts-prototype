import PIXI from 'pixi.js';

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  scale(s) {
    return new Vector(this.x * s, this.y * s);
  }

  divide(s) {
    return this.scale(1 / s);
  }

  subtract(v) {
    return this.add(v.scale(-1));
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  norm() {
    return this.scale(1 / this.magnitude());
  }

  truncate(n) {
    const mag = this.magnitude();
    if(mag > n) {
      return this.norm().scale(n);
    } else {
      return this;
    }
  }

  static origin() {
    return new Vector(0, 0);
  }
}

export function euclideanDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function pointsToRect(p1, p2) {
  return {
    x: Math.min(p1.x, p2.x),
    y: Math.min(p1.y, p2.y),
    width: Math.abs(p2.x - p1.x),
    height: Math.abs(p2.y - p1.y)
  };
}


export function valueInRange(value, min, max) {
  return (value >= min) && (value <= max);
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function intersectsRect(A, B) {
  return (
    // xOverlap
    (valueInRange(A.x, B.x, B.x + B.width)
      || valueInRange(B.x, A.x, A.x + A.width))
    &&
    // yOverlap
    (valueInRange(A.y, B.y, B.y + B.height)
      || valueInRange(B.y, A.y, A.y + A.height))
  );
}

export function pointInRect(p, r) {
  return valueInRange(p.x, r.x, r.x + r.width) && valueInRange(p.y, r.y, r.y + r.height);
}

export function degToRads(degs) {
  return PIXI.DEG_TO_RAD * degs;
}

