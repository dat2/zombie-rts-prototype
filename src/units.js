import PIXI from 'pixi.js';

import { Vector } from './math';
import { UNIT_WIDTH } from './constants';
import { worldToMap } from './map';
import Agent from './agent';

function degToRads(degs) {
  return PIXI.DEG_TO_RAD * degs;
}

class Unit extends Agent {
  constructor({ game, tileWidth, tileHeight, x = 0, y = 0, sx = 1, sy = 1, rotation = 0, resource }) {
    super();

    // set selected variables
    this._selected = false;
    this.selectionRect = new PIXI.Graphics();

    // set the game
    this.game = game;

    // set the position, scale, rotation
    this._position = new Vector(
      (x * tileWidth) / sx + (UNIT_WIDTH * sx) / 2,
      (y * tileHeight) / sy + (UNIT_WIDTH * sy) / 2
    );
    this._scale = new Vector(sx, sy);
    this._rotation = degToRads(rotation);

    // set target variables
    this._target = this._position;
    this.positionTile = { };
    this.targetTile = { };

    // trigger all the setters
    this.sprite = new PIXI.Sprite(resource);
    this.position = this._position;
    this.rotation = this._rotation;
    this.scale = this._scale;
    this.target = this._target;

    // set tile width
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  // position will update positionTile, and the sprite
  get position() {
    return this._position;
  }
  set position({ x, y }) {
    this._position = new Vector(x, y);
    this.sprite.position.x = x;
    this.sprite.position.y = y;

    // update position tile
    this.positionTile = worldToMap(this.game, this.position);

    // move the selection tile
    this.selected = this.selected;
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

  // target will update targetTile
  get target() {
    return this._target;
  }
  set target({ x, y }) {
    this._target = new Vector(x, y);
    this.targetTile = worldToMap(this.game, this._target);
  }

  get selected() {
    return this._selected;
  }

  set selected(selected) {
    this.selectionRect.clear();
    if (selected) {
      this.selectionRect.beginFill(0x00FF00, 0.3);
      this.selectionRect.lineStyle(3, 0x00FF00, 0.8);
      this.selectionRect.drawRect(this.sprite.position.x, this.sprite.position.y, this.sprite.width, this.sprite.height);
    }
    this._selected = selected;
  }

  update() {
    const target = this.target;
    const pos = this.position;

    const dir = target.subtract(pos).norm();
    const speed = 0.5;

    this.position = pos.add(dir.scale(speed));
  }
}


export function loadUnits(game, stage, resources) {
  const resource = resources.spritesheet.textures['character.png'];
  const { tileWidth, tileHeight } = game.tmx;

  // agents
  const units = [
    new Unit({ game, tileWidth, tileHeight, x: 8, y: 5, resource }),
    new Unit({ game, tileWidth, tileHeight, x: 4, y: 5, resource })
  ];

  units.forEach(unit => {
    game.agents.push(unit);

    stage.addChild(unit.sprite);
    stage.addChild(unit.selectionRect);
  });
}
