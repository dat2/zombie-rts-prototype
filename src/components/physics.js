import { Vector } from '../math';

export default function({ velocity = new Vector(0, 0), mass = 1 } = {}) {
  function Physics(component) {
    component.forces = [];
    component.impulses = [];
    component.velocity = velocity;
    component.mass = mass;

    component.addForce = function(f) {
      this.forces.push(f);
    };

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
