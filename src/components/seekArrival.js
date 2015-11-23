export default function({ maxSeekSpeed = 1, maxSeekForce = 5, arrivalRadius = 1 } = {}) {
  function SeekArrival(entity) {
    entity.maxSeekSpeed = maxSeekSpeed;
    entity.maxSeekForce = maxSeekForce;
    entity.arrivalRadius = arrivalRadius;
  }

  SeekArrival.type = 'seekArrival';

  return SeekArrival;
}
