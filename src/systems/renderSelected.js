export default function RenderSelectedSystem(stage) {
  return {
    components: ['select', 'transform'],

    onAdd(engine, entity) {
      stage.addChild(entity.selectionRect);
    },

    run(engine, entity) {
      // copy all the things from the transform
      entity.selectionRect.position.copy(entity.position);
      entity.selectionRect.scale.copy(entity.scale);
      entity.selectionRect.rotation = entity.rotation;
    },

    onRemove(engine, entity) {
      stage.removeChild(entity.selectionRect);
    }
  };
}
