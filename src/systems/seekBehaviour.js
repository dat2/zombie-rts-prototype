import { Vector } from '../math';

export default function SeekBehaviourSystem() {
  return {
    components: ['physics', 'seekBehaviour', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      // get the components?
      const [ physics, seekBehaviour, transform ] = entity.getComponents(...this.components);

      // add the forces to physics
      let force = new Vector(0, 0);

      if(seekBehaviour.seeking) {
        let desiredVelocity = seekBehaviour.target.subtract(transform.position);
        const distance = desiredVelocity.magnitude();

        // if within 1px
        if(distance <= 1) {
          seekBehaviour.seeking = false;
        } else {

          if(distance < seekBehaviour.arrivalRadius) {
            desiredVelocity = desiredVelocity.norm().scale(seekBehaviour.maxSpeed * (distance / seekBehaviour.arrivalRadius));
          } else {
            desiredVelocity = desiredVelocity.norm().scale(seekBehaviour.maxSpeed);
          }

          force = desiredVelocity.subtract(physics.velocity)
            .scale(physics.mass)
            .truncate(seekBehaviour.maxForce);
        }
      }

      physics.addForce(force);
    },

    onRemove(engine, entity) {

    }
  };
}
