export default function RenderSelectedSystem(stage) {
  return {
    components: ['select', 'transform', 'renderable'],

    onAdd(engine, entity) {
      const [ selectC ] = entity.getComponents(...this.components);

      stage.addChild(selectC.selectionRect);
    },

    run(engine, entity) {
      const [ select, transform, renderC ] = entity.getComponents(...this.components);

      // copy all the things from the transform
      select.selectionRect.position.copy(transform.position);
      select.selectionRect.scale.copy(transform.scale);
      select.selectionRect.rotation = transform.rotation;

      select.selectionRect.clear();
      if (select.selected) {
        select.selectionRect.beginFill(0x00FF00, 0.3);
        select.selectionRect.lineStyle(3, 0x00FF00, 0.8);
        select.selectionRect.drawRect(-renderC.renderable.width / 2, -renderC.renderable.height / 2, renderC.renderable.width, renderC.renderable.height);
      }
    },

    onRemove(engine, entity) {
      const [ selectC ] = entity.getComponents(...this.components);

      stage.removeChild(selectC.selectionRect);
    }
  };
}
