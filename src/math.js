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

  subtract(v) {
    return this.add(v.scale(-1));
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  norm() {
    return this.scale(1 / this.magnitude());
  }

  static origin() {
    return new Vector(0, 0);
  }
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

export function linerectIntersectionPoint(v, r) {
  const x = v.x, y = v.y;
  const minX = r.x, minY = r.y, maxX = r.x + r.width, maxY = r.y + r.height;

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  // if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
  const m = (midY - y) / (midX - x);

  if (x <= midX) { // check "left" side
    const minXy = m * (minX - x) + y;
    if (minY < minXy && minXy < maxY) {
      return { x: minX, y: minXy };
    }
  }

  if (x >= midX) { // check "right" side
    const maxXy = m * (maxX - x) + y;
    if (minY < maxXy && maxXy < maxY) {
      return { x: maxX, y: maxXy };
    }
  }

  if (y <= midY) { // check "top" side
    const minYx = (minY - y) / m + x;
    if (minX < minYx && minYx < maxX) {
      return { x: minYx, y: minY };
    }
  }

  if (y >= midY) { // check "bottom" side
    const maxYx = (maxY - y) / m + x;
    if (minX < maxYx && maxYx < maxX) {
      return { x: maxYx, y: maxY };
    }
  }
}
