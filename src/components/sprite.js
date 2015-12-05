import PIXI from 'pixi.js';
import { Vector } from '../math';

// The renderable is just so that we can make different types of renderables
export default function({ texture = '', anchor = new Vector(0, 0) } = {}) {
  function Sprite(component) {
    component.renderable = new PIXI.Sprite(texture);

    component.renderable.anchor.x = anchor.x;
    component.renderable.anchor.y = anchor.y;
    component.renderable.z = 1;
  }

  Sprite.type = 'renderable';

  return Sprite;
}
