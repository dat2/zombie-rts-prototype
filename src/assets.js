import PIXI from 'pixi.js';

export function addAssets() {
  PIXI.loader
    .add([
      { name: 'spritesheet', url: 'assets/spritesheet.json' },
      'assets/maps/map1.tmx'
    ]);
}
