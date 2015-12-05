import { Vector } from '../math';

export default function({ maxSpeed = 32, maxForce = 32 * 3, arrivalRadius = 32 * 3 } = {}) {
  function SeekBehaviour(component) {
    component.maxSpeed = maxSpeed;
    component.maxForce = maxForce;
    component.arrivalRadius = arrivalRadius;

    component.seeking = false;
    component.target = new Vector(0, 0);
  }

  SeekBehaviour.type = 'seekBehaviour';

  return SeekBehaviour;
}
