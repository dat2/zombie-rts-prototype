import PIXI from 'pixi.js';
/*eslint-disable no-unused-vars*/
import pixiTiled from 'pixi-tiledmap';
/*eslint-enable no-unused-vars*/

import makeStage from './stage';
import { addAssets } from './assets.js';
import { loadUnits } from './units.js';
import { loadMap } from './map.js';

// global game object
const game = {
  agents: [],
  map: null,
  tmx: null,
  window: {
    width: 800,
    height: 600
  },
  get collidables() {
    // in future we will add buildings
    return this.agents;
  },
  set collidables(cs) {
    // do nothing
  }
};

// append the renderer
const renderer = new PIXI.autoDetectRenderer(game.window.width, game.window.height);
renderer.view.oncontextmenu = function oncontextmenu(e) {
  e.preventDefault();
};
document.getElementById('game').appendChild(renderer.view);

const stage = makeStage(game, renderer.view);

// main animate loop
function animate() {
  requestAnimationFrame(animate);

  game.agents.forEach(agent => agent.update(game));

  renderer.render(stage);
}

// load and run
addAssets();
PIXI.loader
  .load((loader, resources) => {
    loadMap(game, stage, 'assets/maps/map1.tmx');
    loadUnits(game, stage, resources);
    animate();
  });
