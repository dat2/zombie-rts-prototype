import PIXI from 'pixi.js';

// add assets to load
const assets = [
  { name: 'character', path: 'assets/images/character.png' },
  { name: 'zombie', path: 'assets/images/zombie.png' },
  { name: 'tilesheet', path: 'assets/images/tile_sheet.png' }
];

export function addAssets() {
  assets.forEach(({ name, path }) => PIXI.loader.add(name, path));
}
