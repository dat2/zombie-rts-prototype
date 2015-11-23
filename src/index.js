import PIXI from 'pixi.js';
/*eslint-disable no-unused-vars*/
import pixiTiled from 'pixi-tiledmap';
/*eslint-enable no-unused-vars*/

// ECS
// engine
import Engine from './engine/engine';

// systems
import RenderSystem from './systems/render';
import RenderSelectedSystem from './systems/renderSelected';
import PhysicsSystem from './systems/physics';
import ScreenMovementSystem from './systems/screenMovement';
import SelectionInputSystem from './systems/selectionInput';

// TODO input systems
// TODO behaviour systems

import { loadUnits } from './units';

// components
import TileMap from './components/tilemap';
import Transform from './components/transform';
import ScreenMovement from './components/screenMovement';

// global game object
const game = {
  agents: [],
  window: {
    width: 800,
    height: 600
  }
};

// make the pixijs renderer
const renderer = new PIXI.autoDetectRenderer(game.window.width, game.window.height);
renderer.view.oncontextmenu = function oncontextmenu(e) {
  e.preventDefault();
};
document.getElementById('game').appendChild(renderer.view);

// make a new stage
const stage = new PIXI.Container();
stage.interactive = true;

// make a new engine
const engine = Engine({
  systems: [
    PhysicsSystem(),
    RenderSystem(stage),
    RenderSelectedSystem(stage),
    ScreenMovementSystem(stage, renderer.view, game.window),
    SelectionInputSystem(stage)
  ]
});

// the main game loop
function mainLoop() {
  requestAnimationFrame(mainLoop);

  game.agents.forEach(agent => agent.update(game));

  engine.run();

  renderer.render(stage);
}


// load and run
PIXI.loader
  .add([
    { name: 'spritesheet', url: 'assets/spritesheet.json' },
    'assets/maps/map1.tmx'
  ])
  .load((loader, resources) => {
    const characterTexture = resources.spritesheet.textures['character.png'];
    const markerTexture = resources.spritesheet.textures['marker.png'];

    // add the map
    const map = engine.addEntity([
      Transform(), TileMap({ name: 'assets/maps/map1.tmx' }), ScreenMovement()
    ]);

    // load the units
    loadUnits(engine, characterTexture, map);

    // sort by z component
    stage.children.sort(function(a,b) {
      if (a.z < b.z) {
        return -1;
      }
      if (a.z > b.z) {
        return 1;
      }
      return 0;
    });

    mainLoop();
  });
