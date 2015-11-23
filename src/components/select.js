import PIXI from 'pixi.js';

export default function({ selected = false } = {}) {
  function Select(entity) {
    entity._selected = selected;
    entity.selectionRect = new PIXI.Graphics();
    entity.selectionRect.z = 2;

    Object.defineProperty(entity, 'selected', {
      get() {
        return this._selected;
      },
      set(selected) {
        this._selected = selected;
        this.selectionRect.clear();
        if (selected) {
          this.selectionRect.beginFill(0x00FF00, 0.3);
          this.selectionRect.lineStyle(3, 0x00FF00, 0.8);
          this.selectionRect.drawRect(-this.renderable.width / 2, -this.renderable.height / 2, this.renderable.width, this.renderable.height);
        }
      }
    });
    // trigger the drawing
    entity.selected = entity.selected;
  }

  Select.type = 'select';

  return Select;
}
