import PIXI from 'pixi.js';

export default function({ selected = false } = {}) {
  function Select(component) {
    component.selected = selected;
    component.selectionRect = new PIXI.Graphics();
    component.selectionRect.z = 2;
  }

  Select.type = 'select';

  return Select;
}
