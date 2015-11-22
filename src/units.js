import PIXI from 'pixi.js';

import { Vector } from './math';
import { SeekArrivalBehaviour, CollisionAvoidanceBehaviour } from './behaviours';
import { mapToWorld } from './map';
import { Agent } from './agent';

import { UNIT_WIDTH } from './constants';

class Unit extends Agent {
  constructor({ marker, ...rest }) {
    super({
      behaviours: [
        new SeekArrivalBehaviour({ marker }),
        new CollisionAvoidanceBehaviour()
      ],
      ...rest
    });
    this.isUnit = true;

    // set selected variables
    this._selected = false;
    this.selectionRect = new PIXI.Graphics();
    this.selectionRect.position.x = this.position.x;
    this.selectionRect.position.y = this.position.y;

    // physics
    this.mass = 5;

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.r = Math.max(this.width, this.height);
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

  update(game) {
    super.update(game);

    this.selectionRect.position.x = this.position.x;
    this.selectionRect.position.y = this.position.y;
  }
}

export function loadUnits(game, stage, resources) {
  const resource = resources.spritesheet.textures['character.png'];
  const marker = resources.spritesheet.textures['marker.png'];

  const p1 = mapToWorld(game, { x: 8, y: 5 });
  const p2 = mapToWorld(game, { x: 4, y: 5 });

  // agents
  const units = [
    new Unit({ x: p1.x + 32, y: p1.y + 32, resource, marker }),
    new Unit({ x: p2.x + 32, y: p2.y + 32, resource, marker })
  ];

  units.forEach(unit => {
    game.agents.push(unit);

    stage.addChild(unit.behaviours[0].marker);
    stage.addChild(unit.sprite);
    stage.addChild(unit.selectionRect);
  });
}
