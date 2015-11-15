import { TILE_WIDTH, UNIT_WIDTH } from './constants.js'

import PIXI from 'pixi.js';
import Rx from 'rx';

const { DEG_TO_RAD } = PIXI;

function degToRads(degs) {
  return DEG_TO_RAD * degs;
}

class Unit {
  constructor({ x = 0, y = 0, sx = 1, sy = 1, rotation = 0 }) {
    this.position = {
      x: (x * TILE_WIDTH) / sx + (UNIT_WIDTH * sx) / 2,
      y: (y * TILE_WIDTH) / sy + (UNIT_WIDTH * sy) / 2
    };
    this.scale = {
      x: sx,
      y: sy
    };
    this.rotation = degToRads(rotation);
    this.resource = 'character';

    this.selected = new Rx.BehaviorSubject(false);
  }
}

// units
const units = [
  new Unit({ x: 8, y: 5 }),
  new Unit({ x: 4, y: 11 })
];

export function loadUnits(game, stage, resources) {
  units.forEach(unit => {
    game.units.push(unit);

    const sprite = new PIXI.Sprite(resources[unit.resource].texture);
    unit.sprite = sprite;
    sprite.position.x = unit.position.x;
    sprite.position.y = unit.position.y;
    sprite.scale.x = unit.scale.x;
    sprite.scale.y = unit.scale.y;
    sprite.rotation = unit.rotation;


    const selectionRect = new PIXI.Graphics();
    stage.addChild(selectionRect);

    unit.selected.distinctUntilChanged().subscribe(selected => {
      if (selected) {
        selectionRect.beginFill(0x00FF00, 0.3);
        selectionRect.lineStyle(3, 0x00FF00, 0.8);
        selectionRect.drawRect(sprite.position.x, sprite.position.y, sprite.width, sprite.height);
      } else {
        selectionRect.clear();
      }
    });

    stage.addChild(sprite);
  });
}
