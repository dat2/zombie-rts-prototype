import PIXI from 'pixi.js';
import { Vector } from '../math';

// this is actually a renderable, but needs a different constructor from
// PIXI.sprite
export default function({ name = '' } = {}) {
  function TileMap(entity) {
    entity.renderable = new PIXI.extras.TiledMap(name);
    entity.renderable.z = 0;

    const { tileWidth, tileHeight } = entity.renderable.children[1].map;
    entity.tileWidth = tileWidth;
    entity.tileHeight = tileHeight;

    entity.worldToMap = function({ x , y }) {
      let { tileWidth, tileHeight } = this;

      let target = new Vector(
        Math.floor((x - this.position.x) / tileWidth),
        Math.floor((y - this.position.y) / tileHeight)
      );
      return target;
    };

    entity.mapToWorld = function ({ x, y }) {
      let { tileWidth, tileHeight } = this;

      return new Vector(x * tileWidth, y * tileHeight);
    };

  }

  TileMap.type = 'renderable';

  return TileMap;
}
