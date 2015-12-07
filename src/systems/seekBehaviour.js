import { Vector } from '../math';

export default function SeekBehaviourSystem() {
  return {
    components: ['physics', 'seekBehaviour', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      // get the components?
      const [ physics, seekBehaviour, transform ] = entity.getComponents(...this.components);

      // add the impulses to physics
      let impulse = new Vector(0, 0);

      if(seekBehaviour.seeking) {
        let desiredVelocity = seekBehaviour.target.subtract(transform.position);
        const distance = desiredVelocity.magnitude();

        // if within 3px
        if(distance <= 3) {
          seekBehaviour.seeking = false;

          // JUST make it stop
          impulse = physics.velocity.scale(-1);
        } else {

          if(distance < seekBehaviour.arrivalRadius) {
            desiredVelocity = desiredVelocity.norm().scale(seekBehaviour.maxSpeed * (distance / seekBehaviour.arrivalRadius));
          } else {
            desiredVelocity = desiredVelocity.norm().scale(seekBehaviour.maxSpeed);
          }

          impulse = desiredVelocity.subtract(physics.velocity)
            .divide(physics.mass)
            .truncate(seekBehaviour.maxForce);
        }
      }

      physics.addImpulse(impulse);
    },

    onRemove(engine, entity) {

    }
  };
}
