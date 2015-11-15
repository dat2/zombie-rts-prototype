import PIXI from 'pixi.js';
import { addAssets } from './assets';
import { loadUnits } from './units';

const game = {
  width: 800,
  height: 600,
  units: []
};

const renderer = new PIXI.WebGLRenderer(game.width, game.height);
document.getElementById("game").appendChild(renderer.view);

const stage = new PIXI.Container();

function animate() {
  requestAnimationFrame(animate);

  game.units.forEach(sprite => {
    sprite.rotation += 0.01;
  });

  renderer.render(stage);
}

addAssets();
PIXI.loader
  .load((loader, resources) => {
    loadUnits(game, stage, resources);
    animate();
  });
