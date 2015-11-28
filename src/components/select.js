import PIXI from 'pixi.js';

export default function({ selected = false } = {}) {
  function Select(entity) {
    entity.selected = selected;
    entity.selectionRect = new PIXI.Graphics();
    entity.selectionRect.z = 2;
  }

  Select.type = 'select';

  return Select;
}
