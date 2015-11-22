import PIXI from 'pixi.js';
import { Vector } from './math';

export class DisplayAgent {

  constructor({ x, y, sx = 1, sy = 1, rotation = 0, resource } = {}) {
    this._position = new Vector(x, y);
    this._scale = new Vector(sx, sy);
    this._rotation = rotation;

    this.sprite = new PIXI.Sprite(resource);
    this.position = this.position;
    this.scale = this.scale;
    this.rotation = this.rotation;

    this.velocity = new Vector(0, 0);
  }

  // position will update positionTile, and the sprite
  get position() {
    return this._position;
  }
  set position({ x, y }) {
    this._position = new Vector(x, y);
    this.sprite.position.x = x;
    this.sprite.position.y = y;
  }

  // rotation will update the sprite
  get rotation() {
    return this._rotation;
  }
  set rotation(rotation) {
    this._rotation = rotation;
    this.sprite.rotation = rotation;
  }

  // scale will update the sprite
  get scale() {
    return this._scale;
  }
  set scale({ x, y }) {
    this._scale = new Vector(x, y);
    this.sprite.scale.x = x;
    this.sprite.scale.y = y;
  }

}
