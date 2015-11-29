export default function CollisionSystem() {
  return {
    components: ['physics', 'collideShape', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      const [ physics, collideShape, transform ] = entity.getComponents(...this.components);

      // TODO :)

      // generate a force, and add it to the physics array
    },

    onRemove(engine, entity) {
    }
  };
}
