import PIXI from 'pixi.js';

const { DEG_TO_RAD } = PIXI;

function rads(degs) {
  return DEG_TO_RAD * degs;
}

// units
const units = [
  { position: { x: 400, y: 300 }, scale: { x: 2, y: 2 }, rotation: rads(180), resource: 'character' },
  { position: { x: 600, y: 200 }, scale: { x: 2, y: 2 }, rotation: rads(90), resource: 'character' }
];

export function loadUnits(game, stage, resources) {
  units.forEach(unit => {
    const sprite = new PIXI.Sprite(resources[unit.resource].texture);

    sprite.position.x = unit.position.x;
    sprite.position.y = unit.position.y;

    sprite.scale.x = unit.scale.x;
    sprite.scale.y = unit.scale.y;

    sprite.rotation = unit.rotation;

    stage.addChild(sprite);

    game.units.push(sprite);
  });
}
