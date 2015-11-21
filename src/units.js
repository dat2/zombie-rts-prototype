import PIXI from 'pixi.js';

import { Vector } from './math';
import { UNIT_WIDTH } from './constants';
import Agent from './agent';
import { SeekArrivalBehaviour } from './behaviours';

function degToRads(degs) {
  return PIXI.DEG_TO_RAD * degs;
}

class Unit extends Agent {
  constructor({ game, tileWidth, tileHeight, x = 0, y = 0, sx = 1, sy = 1, rotation = 0, resource, marker }) {
    super({ behaviours: [ new SeekArrivalBehaviour({ marker }) ] });

    // set selected variables
    this._selected = false;
    this.selectionRect = new PIXI.Graphics();
    this.isUnit = true;

    // set the game
    this.game = game;

    // set the position, scale, rotation
    this._position = new Vector(
      (x * tileWidth) / sx + (UNIT_WIDTH * sx),
      (y * tileHeight) / sy + (UNIT_WIDTH * sy)
    );
    this._scale = new Vector(sx, sy);
    this._rotation = degToRads(rotation);

    // physics
    this.velocity = new Vector(0, 0);
    this.mass = 5;

    // trigger all the setters
    this.sprite = new PIXI.Sprite(resource);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.position = this._position;
    this.rotation = this._rotation;
    this.scale = this._scale;

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
    this.selectionRect.position.x = x;
    this.selectionRect.position.y = y;
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

  get selected() {
    return this._selected;
  }

  set selected(selected) {
    this._selected = selected;
    this.selectionRect.clear();
    if (selected) {
      this.selectionRect.beginFill(0x00FF00, 0.3);
      this.selectionRect.lineStyle(3, 0x00FF00, 0.8);
      this.selectionRect.drawRect(-this.sprite.width / 2, -this.sprite.height / 2, this.sprite.width, this.sprite.height);
    }
  }
}


export function loadUnits(game, stage, resources) {
  const resource = resources.spritesheet.textures['character.png'];
  const marker = resources.spritesheet.textures['marker.png'];

  const { tileWidth, tileHeight } = game.tmx;

  // agents
  const units = [
    new Unit({ game, tileWidth, tileHeight, x: 8, y: 5, resource, marker }),
    new Unit({ game, tileWidth, tileHeight, x: 4, y: 5, resource, marker })
  ];

  units.forEach(unit => {
    game.agents.push(unit);

    stage.addChild(unit.behaviours[0].marker);
    stage.addChild(unit.sprite);
    stage.addChild(unit.selectionRect);
  });
}
