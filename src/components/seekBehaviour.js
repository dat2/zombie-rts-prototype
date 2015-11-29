import { Vector } from '../math';

export default function({ maxSpeed = 32, maxForce = 32 * 3, arrivalRadius = 32 * 3 } = {}) {
  function SeekBehaviour(entity) {
    entity.maxSpeed = maxSpeed;
    entity.maxForce = maxForce;
    entity.arrivalRadius = arrivalRadius;

    entity.seeking = false;
    entity.target = new Vector(0, 0);
  }

  SeekBehaviour.type = 'seekBehaviour';

  return SeekBehaviour;
}
