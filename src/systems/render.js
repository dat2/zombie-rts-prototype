export default function RenderSystem(stage) {
  return {
    components: ['renderable', 'transform'],

    onAdd(engine, entity) {
      stage.addChild(entity.renderable);
    },

    run(engine, entity) {
      // copy all the things from the transform
      entity.renderable.position.copy(entity.position);
      entity.renderable.scale.copy(entity.scale);
      entity.renderable.rotation = entity.rotation;
    },

    onRemove(engine, entity) {
      stage.removeChild(entity.renderable);
    }
  };
}
