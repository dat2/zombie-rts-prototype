import PIXI from 'pixi.js';

// add assets to load
const assets = [
  { name: 'character', path: 'assets/images/character.png' },
  { name: 'zombie', path: 'assets/images/zombie.png' }
];

const maps = [
  'assets/maps/map1.tmx'
];

export function addAssets() {
  assets.forEach(({ name, path }) => PIXI.loader.add(name, path));
  maps.forEach(map => PIXI.loader.add(map));
}
