import PIXI from 'pixi.js';
import pixiTiled from 'pixi-tiledmap';

import { addAssets } from './assets.js';
import { loadUnits } from './units.js';
import { loadMap } from './map.js';
import { handleSelection, handleMove } from './input.js';

// global game object
const game = {
  width: 1280,
  height: 1280,
  units: [],
  map: null
};

// append the renderer
const renderer = new PIXI.autoDetectRenderer(game.width, game.height);
renderer.view.oncontextmenu = function(e) {
  e.preventDefault();
}
document.getElementById("game").appendChild(renderer.view);

// make a new stage
const stage = new PIXI.Container();
stage.interactive = true;

// input
handleSelection(stage, game);
handleMove(stage, game);

// main animate loop
function animate() {
  requestAnimationFrame(animate);

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
