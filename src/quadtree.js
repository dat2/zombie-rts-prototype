import PIXI from 'pixi.js';

export default class QuadTree {
  constructor({ maxObjects = 3, maxLevels = 5, level = 0, bounds: { x, y, width, height } }) {
    this.maxObjects = maxObjects; // how many objects before it splits
    this.maxLevels = maxLevels; // height of the tree

    this.level = level;
    this.bounds = new PIXI.Rectangle(x, y, width, height);
    this.objects = [];
    this.nodes = [];
  }

  clear() {
    this.objects = [];
    this.nodes.forEach(node => node.clear());
  }

  split() {
    const { x, y, width, height } = this.bounds;
    const subWidth = width / 2, subHeight = height / 2;

    const makeSubtree = (bounds) => new QuadTree({ level: this.level+1, maxObjects: this.maxObjects, maxLevels: this.maxLevels, bounds });

    this.nodes = [
      makeSubtree({ x: x + subWidth, y, width: subWidth, height: subHeight }),
      makeSubtree({ x, y, width: subWidth, height: subHeight }),
      makeSubtree({ x, y: y + subHeight, width: subWidth, height: subHeight }),
      makeSubtree({ x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight })
    ];
  }

  getIndex({ rect: { x, y, width, height } }) {
    let index = -1;

    const { x: bX, y: bY, width: bW, height: bH } = this.bounds;
    const verticalMidpoint = bX + bW / 2, horizontalMidpoint = bY + bH / 2;

    const inTop = (y > bY && y < horizontalMidpoint && y + height < horizontalMidpoint);
    const inBottom = (y > bY && y > horizontalMidpoint);
    const inLeft = (x > bX && x < verticalMidpoint && x + width < verticalMidpoint);
    const inRight = (x > bX && x > verticalMidpoint);

    // 0 and 1
    if(inTop) {
      if(inLeft) {
        index = 1;
      } else if(inRight) {
        index = 0;
      }
    // 2 and 3
    } else if(inBottom) {
      if(inLeft) {
        index = 2;
      } else if(inRight) {
        index = 3;
      }
    }

    return index;
  }

  insert(object) {
    if(this.nodes.length) {
      const index = this.getIndex(object);

      if(index !== -1) {
        this.nodes[index].insert(object);
      }
    }

    this.objects.push(object);

    // split if too big
    if(this.objects.length > this.maxObjects && this.level < this.maxLevels) {
      if(!this.nodes.length) {
        this.split();
      }

      let i = 0;
      while (i < this.objects.length) {
        const index = this.getIndex(this.objects[i]);
        if(index !== -1) {
          const [obj] = this.objects.splice(i, 1);
          this.nodes[i].insert(obj);
        } else {
          i++;
        }
      }
    }
  }

  remove(object) {
    const index = this.getIndex(object);
    if(index !== -1) {
      this.nodes[index].remove(object);
    }

    // do the actual removing
    const i = this.objects.indexOf(object);
    if(i !== -1) {
      this.objects.splice(i, 1);
    }
  }

  retrieve(rect, objs = []) {
    const i = this.getIndex({ rect });

    if(i !== -1 && this.nodes.length) {
      this.nodes[i].retrieve({ rect }, objs);
    }

    objs.push(...this.objects);

    return objs;
  }
}
