import PIXI from 'pixi.js';

export function loadMap(game, stage, mapName) {

  game.map = new PIXI.extras.TiledMap(mapName);

  game.map.position.x = 0;
  game.map.position.y = 0;

  game.tmx = game.map.children[1].map;

  stage.addChild(game.map);
}

export function worldToMap(game, point) {
  const { x, y } = game.map;
  let { tileWidth, tileHeight } = game.tmx;

  let target = {
    x: Math.floor((point.x - x) / tileWidth),
    y: Math.floor((point.y - y) / tileHeight)
  };
  return target;
}

export function mapToWorld(game, { x, y }) {
  let { tileWidth, tileHeight } = game.tmx;
  return {
    x: (x * tileWidth),
    y: (y * tileHeight)
  };
}
