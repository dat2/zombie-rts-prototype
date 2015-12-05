import PIXI from 'pixi.js';
import { Vector } from '../math';

// this is actually a renderable, but needs a different constructor from
// PIXI.sprite
export default function({ name = '' } = {}) {
  function TileMap(component) {
    component.renderable = new PIXI.extras.TiledMap(name);
    component.renderable.z = 0;

    const { tileWidth, tileHeight } = component.renderable.children[1].map;
    component.tileWidth = tileWidth;
    component.tileHeight = tileHeight;

    component.worldToMap = function({ x , y }) {
      let { tileWidth, tileHeight } = this;

      let target = new Vector(
        Math.floor((x - this.position.x) / tileWidth),
        Math.floor((y - this.position.y) / tileHeight)
      );
      return target;
    };

    component.mapToWorld = function ({ x, y }) {
      let { tileWidth, tileHeight } = this;

      return new Vector(x * tileWidth, y * tileHeight);
    };

  }

  TileMap.type = 'renderable';

  return TileMap;
}
