import { Vector } from '../math';

export default function({ width = 32, height = 32, x = 0, y = 0 } = {}) {
  function AxisAlignedBoundingBox(component) {
    component.x = x;
    component.y = y;
    component.width = width;
    component.height = height;

    component.intersects = function({ x, y, width, height }) {
      return !(
        this.x + this.width < x || x + width < this.x ||
        this.y + this.height < y || y + height < this.y
      );
    };

    // return the normals for this aabb , then another one for that one
    component.collisionNormal = function({ x, y, width, height }) {

      // the right / top face of this box hit that box
      const rightFace = (this.x + this.width >= x && this.y + this.height > y);
      const topFace = (this.x + this.width >= x && this.y + this.height <= y);

      // the left / bottom face of this box hit that box
      const leftFace = (x + width >= this.x && y + height > this.y);
      const bottomFace = (x + width >= this.x && y + height <= this.y);

      const h = rightFace ? 1 : (leftFace ? -1 : 0);
      const v = topFace ? -1 : (bottomFace ? 1 : 0);

      return new Vector(h, v);
    };

    component.show = function() {
      return `AABB (x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height})`;
    };

    component.move = function({ x, y }) {
      const newC = Object.assign({}, this);
      newC.x += x;
      newC.y += y;

      return newC;
    };
  }

  AxisAlignedBoundingBox.type = 'aabb';

  return AxisAlignedBoundingBox;
}
