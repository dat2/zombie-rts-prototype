export default function PhysicsSystem() {
  return {
    components: ['physics', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      // get the components?
      const [ physics, transform ] = entity.getComponents(...this.components);

      // add the forces to velocity
      physics.velocity = physics.forces.reduce((v,f) => v.add(f), physics.velocity);
      physics.forces = [];

      // update position with velocity
      transform.position = transform.position.add(physics.velocity);
    },

    onRemove(engine, entity) {
    }
  };
}
