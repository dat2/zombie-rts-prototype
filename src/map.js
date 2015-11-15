import PIXI from 'pixi.js';

export function loadMap(game, stage, mapName) {

  game.map = new PIXI.extras.TiledMap(mapName);

  game.map.position.x = 0;
  game.map.position.y = 0;
  game.map.scale.x = 1;
  game.map.scale.y = 1;

  stage.addChild(game.map);
}
