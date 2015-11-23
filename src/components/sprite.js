import PIXI from 'pixi.js';
import { Vector } from '../math';

// The renderable is just so that we can make different types of renderables
export default function({ texture = '', anchor = new Vector(0, 0) } = {}) {
  function Sprite(entity) {
    entity.renderable = new PIXI.Sprite(texture);
    entity.renderable.anchor.x = anchor.x;
    entity.renderable.anchor.y = anchor.y;
    entity.renderable.z = 1;
  }

  Sprite.type = 'renderable';

  return Sprite;
}
