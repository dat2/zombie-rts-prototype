import { Vector } from '../math';

export default function({ velocity = new Vector(0, 0), mass = 1, restitution = 0.5 } = {}) {
  function Physics(component) {
    component.forces = [];
    component.impulses = [];
    component.velocity = velocity;
    component.mass = mass;
    component.inverseMass = 1.0 / mass;
    component.restitution = restitution;

    component.clearForces = function() {
      this.forces = [];
    };

    component.addImpulse = function(i) {
      this.impulses.push(i);
    };
  }

  Physics.type = 'physics';

  return Physics;
}
