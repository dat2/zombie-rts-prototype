export default function PhysicsSystem() {
  return {
    components: ['physics', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      // add the forces to velocity
      entity.velocity = entity.forces.reduce((v,f) => v.add(f), entity.velocity);
      entity.forces = [];

      // update position with velocity
      entity.position = entity.position.add(entity.velocity);
    },

    onRemove(engine, entity) {
    }
  };
}
