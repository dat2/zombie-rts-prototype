import { Vector } from '../math';

export default function({ velocity = new Vector(0, 0), mass = 1 } = {}) {
  function Physics(entity) {
    entity.forces = [];
    entity.velocity = velocity;
    entity.mass = mass;

    entity.addForce = function(f) {
      this.forces.push(f);
    };
  }

  Physics.type = 'physics';

  return Physics;
}
