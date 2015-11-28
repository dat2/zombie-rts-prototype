export default function({ maxSpeed = 1, maxForce = 5, arrivalRadius = 1 } = {}) {
  function SeekArrival(entity) {
    entity.maxSpeed = maxSpeed;
    entity.maxForce = maxForce;
    entity.arrivalRadius = arrivalRadius;
    entity.seeking = false;
  }

  SeekArrival.type = 'seekArrival';

  return SeekArrival;
}
