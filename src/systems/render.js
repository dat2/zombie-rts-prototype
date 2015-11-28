export default function RenderSystem(stage) {
  return {
    components: ['renderable', 'transform'],

    onAdd(engine, entity) {
      const [ renderC ] = entity.getComponents(...this.components);
      stage.addChild(renderC.renderable);
    },

    run(engine, entity) {
      const [ renderC, transform ] = entity.getComponents(...this.components);

      // copy all the things from the transform
      renderC.renderable.position.copy(transform.position);
      renderC.renderable.scale.copy(transform.scale);
      renderC.renderable.rotation = transform.rotation;
    },

    onRemove(engine, entity) {
      const [ renderC ] = entity.getComponents(...this.components);

      stage.removeChild(renderC.renderable);
    }
  };
}
