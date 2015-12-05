import PIXI from 'pixi.js';
/*eslint-disable no-unused-vars*/
import pixiTiled from 'pixi-tiledmap';
/*eslint-enable no-unused-vars*/

// ECS
// engine
import Engine from './engine/engine';

// systems

// input
import ScreenMovementSystem from './systems/screenMovement';
import SelectionInputSystem from './systems/selectionInput';

//ai
import SeekBehaviourSystem from './systems/seekBehaviour';
import CollisionAvoidSystem from './systems/collisionAvoid';

// physics
import CollisionSystem from './systems/collision';
import PhysicsSystem from './systems/physics';

// render
import RenderSystem from './systems/render';
import RenderSelectedSystem from './systems/renderSelected';

// TODO input systems
// TODO behaviour systems
import { loadUnits } from './units';

// components
import TileMap from './components/tilemap';
import Transform from './components/transform';
import ScreenMovement from './components/screenMovement';

const windowSize = {
  width: 800,
  height: 600
};

// make the pixijs renderer
const renderer = new PIXI.autoDetectRenderer(windowSize.width, windowSize.height);
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
    // input
    ScreenMovementSystem(stage, renderer.view, windowSize),
    SelectionInputSystem(stage),

    // ai behaviours
    SeekBehaviourSystem(), CollisionAvoidSystem(),

    CollisionSystem(stage),

    // physics
    PhysicsSystem(stage),

    // render
    RenderSystem(stage),
    RenderSelectedSystem(stage)
  ]
});

// the main game loop
function mainLoop() {
  requestAnimationFrame(mainLoop);

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
    loadUnits(engine, characterTexture, ...map.getComponents('renderable'));

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
